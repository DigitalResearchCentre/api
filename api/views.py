import os
import random
import shutil
import zipfile
import json
import urllib
import urllib2
import datetime
import requests
from django.db import models, transaction
from django.http import HttpResponse, Http404
from django.conf import settings
from django.conf.urls import patterns, url
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_control
from django.db.models import Manager

from rest_framework import status, filters
from rest_framework import permissions
from rest_framework import generics, mixins
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authentication import SessionAuthentication

from api.models import (
    Community, Membership, Entity, Doc, Text, Revision, RefsDecl, Task,
    APIUser, Group, UserMapping, CommunityMapping, Partner, Invitation, Task,
    Action)
from api.serializers import (
    CommunitySerializer, APIUserSerializer, DocSerializer, EntitySerializer,
    TextSerializer, RevisionSerializer, RefsDeclSerializer, TaskSerializer,
    InvitationSerializer, MembershipSerializer, GroupSerializer,)
from api import tasks

class UnsafeSessionAuthentication(SessionAuthentication):

    def authenticate(self, request):
        http_request = request._request
        user = getattr(http_request, 'user', None)

        if not user or not user.is_active:
            return None
        return (user, None)

@api_view(['GET'])
@ensure_csrf_cookie
def api_root(request, format=None):
    return Response({
        'communities': reverse('community-list', request=request),
        'docs': reverse('doc-list', request=request),
        'entities': reverse('entity-list', request=request),
        'texts': reverse('text-list', request=request),
        'users': reverse('user-list', request=request),
    })


class RelationView(
    mixins.ListModelMixin, generics.RetrieveUpdateDestroyAPIView
):
    func = None
    response_class = None
    reserve_kwargs = ['slug', 'pk']
    methods = None
    permission_classes = [permissions.AllowAny]

    def get_response(self, result):
        if result is None:
            raise Http404
        if self.response_class is not None:
            return self.response_class(result)
        elif isinstance(result, models.query.QuerySet):
            self.queryset = result
            return self.list(self.request)
        elif isinstance(result, models.Manager):
            self.queryset = result.all()
            return self.list(self.request)
        elif isinstance(result, models.Model):
            serializer = self.get_serializer(result)
            return Response(serializer.data)
        elif isinstance(result, HttpResponse):
            return result
        else:
            return Response(result)

    def api_handler(self, request, *args, **kwargs):
        obj = self.get_object()
        result = getattr(obj, self.func)
        if not isinstance(result, Manager) and callable(result):
            kwargs = dict(self.kwargs)
            for k in self.reserve_kwargs:
                kwargs.pop(k, None)
            result = result(**kwargs)
        return self.get_response(result)

    # Note: session based authentication is explicitly CSRF validated,
    # all other authentication is CSRF exempt.
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        """
        `.dispatch()` is pretty much the same as Django's regular dispatch,
        but with extra hooks for startup, finalize, and exception handling.
        """
        request = self.initialize_request(request, *args, **kwargs)
        self.request = request
        self.args = args
        self.kwargs = kwargs
        self.headers = self.default_response_headers  # deprecate?

        try:
            self.initial(request, *args, **kwargs)
            method = request.method.lower()

            # Get the appropriate handler method
            if method in self.http_method_names and (
                self.methods is None or method in self.methods
            ):
                if self.func is None:
                    handler = getattr(self, request.method.lower(),
                                      self.http_method_not_allowed)
                else:
                    handler = getattr(self, '_%s_%s' % (method, self.func),
                                      self.api_handler)
            else:
                handler = self.http_method_not_allowed
            response = handler(request, *args, **kwargs)

        except Exception as exc:
            response = self.handle_exception(exc)

        self.response = self.finalize_response(request, response,
                                               *args, **kwargs)
        return self.response

    @classmethod
    def urlpatterns(cls, configs, extra={}):
        args = ['']
        for conf in configs:
            conf = dict(extra, **conf)
            func = conf.get('func', '')
            u = '%s/%s' % (func, conf.pop('func_args', '')) if func else ''
            args.append(url(r'^%s$' % u, cls.as_view(**conf),))
        return patterns(*args)


class CreateModelMixin(object):
    """
    Create a model instance.
    """
    def create(self, data={}, files=None, *args, **kwargs):
        serializer = self.get_serializer(data=data, files=files)

        if serializer.is_valid():
            self.object = serializer.save(force_insert=True)
            self.post_save(self.object, created=True)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED,
                            headers=headers)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_success_headers(self, data):
        try:
            return {'Location': data['url']}
        except (TypeError, KeyError):
            return {}


class APIView(CreateModelMixin, RelationView):
    authentication_classes = (UnsafeSessionAuthentication,)

    def _post_transcribe(self, request, *args, **kwargs):
        doc = Doc.objects.get(pk=self.kwargs['pk'])
        data = request.DATA.copy()
        data.update({'doc': doc.pk})
        action = 'transcribe'
        user = request.user
        community = doc.get_community()
        time = datetime.datetime.now() - datetime.timedelta(minutes=10)
        qs = Action.objects.filter(
            action=action, user=user, community=community, created__gt=time,
            data__contains=doc.get_urn)
        if not qs.exists():
            Action.objects.create(
                user=user, community=community, 
                action=action, data={'doc': doc.get_urn()})
        return self.create(data=data)

    @method_decorator(cache_control(private=True, max_age=3600))
    def _get_has_image(self, request, *args, **kwargs):
        zoom = self.kwargs.get('zoom', None)
        x = self.kwargs.get('x', None)
        y = self.kwargs.get('y', None)
        return self.get_response(
            self.get_object().has_image(zoom=zoom, x=x, y=y))

    def _get_xmlvalidate(self, request, *args, **kwargs):
        xml = request.REQUEST.get('xml', None)
        return self.get_response(self.get_object().validate(xml))

    def _get_assign(self, request, *args, **kwargs):
        membership = Membership.objects.get(pk=kwargs['pk'])
        doc_pk = kwargs.get('doc_pk')
        data = []
        if doc_pk:
            doc = Doc.objects.get(pk=kwargs.get('doc_pk'))
            for page in doc.has_parts().prefetch_related('task_set'):
                names = []
                child = {'key': page.pk}
                for task in page.task_set.all():
                    if task.membership == membership:
                        child['select'] = True
                    names.append(task.membership.name)
                names = ['(%s) %s' % pair 
                            for pair in zip(xrange(1, len(names)+1), names)]
                names = ' - %s' % ', '.join(names) if names else ''
                child['title'] = page.name + names 
                data.append(child)
        else:
            for doc in membership.community.docs.all():
                data.append({ 
                    'title': doc.name, 'key': doc.pk, 'isLazy': True})

        return self.get_response(data)

    def _get_can_edit(self, request, *args, **kwargs):
        user = self.get_object()
        doc_pk = self.kwargs['doc_pk']
        qs = Task.objects.filter(doc__id=doc_pk, membership__user=user)
        editable = qs.exists()
        if not editable:
            doc = Doc.objects.get(pk=doc_pk)
            community = doc.get_community()
            try:
                community.get_membership(user=user, 
                                     role__name__in=('Leader', 'Co Leader'))
                editable = True
            except Membership.DoesNotExist:
                pass
        return self.get_response({'editable': editable})


    @transaction.atomic
    def _post_assign(self, request, *args, **kwargs):
        pk_list = map(int, request.POST.getlist('docs[]', []))
        membership = Membership.objects.get(pk=kwargs['pk'])
        doc = Doc.objects.get(pk=kwargs['doc_pk'])
        doc_pk_list = membership.task_set.filter(
            doc__tree_id=doc.tree_id, 
            doc__lft__gte=doc.lft, doc__rgt__lte=doc.rgt,
        ).values_list('doc_id', flat=True)
        add_pk_list = [pk for pk in pk_list if pk not in doc_pk_list]
        del_pk_list = [pk for pk in doc_pk_list if pk not in pk_list]
        for doc in Doc.objects.filter(pk__in=add_pk_list).exclude():
            Task.objects.create(doc=doc, membership=membership)
        qs = Task.objects.filter(doc__id__in=del_pk_list, membership=membership)
        qs.delete()
        return self._get_assign(self, request, *args, **kwargs)


    def _post_xmlvalidate(self, request, *args, **kwargs):
        return self._get_xmlvalidate(request, *args, **kwargs)

    def _post_js(self, request, *args, **kwargs):
        data = request.DATA.copy()
        community = Community.objects.get(pk=self.kwargs['pk'])
        qs = community.js_set.all()
        if qs.exists():
            qs.delete()
        data.update({'community': self.kwargs['pk']})
        return self.create(data=data, files=request.FILES)

    def _post_css(self, request, *args, **kwargs):
        data = request.DATA.copy()
        community = Community.objects.get(pk=self.kwargs['pk'])
        qs = community.css_set.all()
        if qs.exists():
            qs.delete()
        data.update({'community': self.kwargs['pk']})
        return self.create(data=data, files=request.FILES)

    def _post_schema(self, request, *args, **kwargs):
        data = request.DATA.copy()
        community = Community.objects.get(pk=self.kwargs['pk'])
        qs = community.schema_set.all()
        if qs.exists():
            qs.delete()
        data.update({'community': self.kwargs['pk']})
        return self.create(data=data, files=request.FILES)

    def _post_upload_tei(self, request, *args, **kwargs):
        from lxml import etree
        f = request.FILES['xml']
        community = self.get_object()
        result = tasks.add_text_file.delay(f.read(), community)
        Action.objects.create(
           user=request.user, community=community, action='add text file',
           key=result.id, data={'file': f.name})
        return self.get_response({'status': result.status, 'id': result.id})

    def _post_upload_zip(self, request, *args, **kwargs):
        doc = self.get_object()
        zip_file = request.FILES['zip']
        tmp_zip_path = os.path.join(
            settings.MEDIA_ROOT, str(random.getrandbits(64)))
        os.makedirs(tmp_zip_path, 0755)
        zip_file = zipfile.ZipFile(zip_file)
        zip_file.extractall(tmp_zip_path)
        result = tasks.add_image_zip.delay(doc, tmp_zip_path)
        Action.objects.create(
            user=request.user, community=doc.get_community(), action='add image zip', 
            key=result.id, data={'doc': doc.get_urn()})
        return self.get_response({'status': result.status, 'id': result.id})

    def _post_add_refsdecl(self, request, *args, **kwargs):
        refsdecl = RefsDecl.objects.get(pk=self.kwargs['refsdecl_pk'])
        self.get_object().add(refsdecl)
        return refsdecl

class CommunityDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Community
    serializer_class = CommunitySerializer
    permission_classes = (permissions.AllowAny,)


class CommunityList(generics.ListCreateAPIView):
    model = Community
    serializer_class = CommunitySerializer

    def create_liferay_community(self):
        url = settings.PARTNER_URL + 'add-organization'
        url = settings.TMP_LIFERAY_API + 'add-organization'
        values = {
            'parentOrganizationId': 10718,
            'name': self.object.name,
            'comments': self.object.description
        }
        try:
            values['userId'] = self.request.user.usermapping.mapping_id
        except UserMapping.DoesNotExist:
            pass
        r = requests.get(url, auth=(
            settings.TMP_LIFERAY_USERNAME, 
            settings.TMP_LIFERAY_PASSWORD,
        ), params=values)
        resp_json = r.json()
        url = settings.PARTNER_URL + 'get-group-by-organization-id'
        values = {
            'organizationId': resp_json['organizationId'],
        }
        data = urllib.urlencode(values)
        resp = urllib2.urlopen(urllib2.Request(url, data))
        resp_json = json.loads(resp.read())
        partner = Partner.objects.get(pk=1)
        CommunityMapping.objects.create(
            community=self.object, mapping_id=resp_json['groupId'],
            partner=partner
        )

    def post(self, request, *args, **kwargs):
        response = self.create(request, *args, **kwargs)
        if hasattr(self, 'object') and self.object:
            #self.create_liferay_community()
            self.object.add_membership(
                user=request.user, community=self.object,
                role=Group.objects.get(name='Leader'))
        return response


class DocDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Doc
    serializer_class = DocSerializer
    url_name = 'doc-detail'
    permission_classes = (permissions.AllowAny,)
    post_form = None
    put_form = None

    def delete(self, request, *args, **kwargs):
        obj = self.get_object()
        community = obj.get_community()
        result = tasks.delete_doc.delay(obj)
        Action.objects.create(
            user=request.user, community=community, action='delete document', 
            key=result.id, data={'doc': obj.get_urn()})
        return Response(status=status.HTTP_204_NO_CONTENT)

#    has_image = serializers.URLField(source='has_image')
#    has_transcript = serializers.HyperlinkedRelatedField(
#        many=True, read_only=True, view_name='transcript-detail')

class DocList(generics.ListCreateAPIView):
    model = Doc
    serializer_class = DocSerializer


class EntityDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Entity
    serializer_class = EntitySerializer


class EntityList(generics.ListCreateAPIView):
    model = Entity
    serializer_class = EntitySerializer


class TextDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Text
    serializer_class = TextSerializer

    def delete(self, request, *args, **kwargs):
        obj = self.get_object()
        doc = obj.is_text_in()
        community = doc.get_community()
        result = tasks.delete_text.delay(obj)
        Action.objects.create(
            user=request.user, community=community, 
            action='delete document text', 
            key=result.id, data={'doc': doc.get_urn()})
        return Response(status=status.HTTP_204_NO_CONTENT)


class TextList(generics.ListCreateAPIView):
    model = Text
    serializer_class = TextSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    model = APIUser
    serializer_class = APIUserSerializer


class UserInfo(UserDetail):
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, request, *args, **kwargs):
        return super(UserInfo, self).dispatch(request, *args, **kwargs)


class RefsDeclList(generics.ListCreateAPIView):
    model = RefsDecl
    serializer_class = RefsDeclSerializer
    filter_fields = ('text', )

    def post(self, request, *args, **kwargs):
        resp = super(RefsDeclList, self).post(request, *args, **kwargs)
        community_pk = request.DATA.get('community')
        if community_pk:
            community = Community.objects.get(pk=community_pk)
            community.refsdecls.add(self.object)
        return resp


class RefsDeclDetail(generics.RetrieveUpdateDestroyAPIView):
    model = RefsDecl
    serializer_class = RefsDeclSerializer


class TaskPermission(permissions.IsAuthenticatedOrReadOnly):

    def has_object_permission(self, request, view, obj):
        return (
            super(TaskPermission, self).has_object_permission(
                request, view, obj) or
            obj.has_permission(self.request.user)
        )


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Task
    serializer_class = TaskSerializer
    permission_classes = (TaskPermission,)

    def post(self, *args, **kwargs):
        return self.put(*args, **kwargs)


class TaskList(generics.ListCreateAPIView):
    model = Task
    serializer_class = TaskSerializer
    filter_fields = ('doc', )


class UserList(generics.ListCreateAPIView):
    model = APIUser
    serializer_class = APIUserSerializer

class MembershipDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Membership
    serializer_class = MembershipSerializer

class MembershipList(generics.ListCreateAPIView):
    model = Membership
    serializer_class = MembershipSerializer

class RoleDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Group
    serializer_class = GroupSerializer

class InvitationList(generics.ListCreateAPIView):
    model = Invitation
    serializer_class = InvitationSerializer

class TranscribeView(generics.CreateAPIView):
    model = Revision
    serializer_class = RevisionSerializer
    permission_classes = (permissions.AllowAny,)



