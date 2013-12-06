import os
import random
import shutil
import zipfile
import json
import urllib
import urllib2
from django.db import models
from django.http import HttpResponse, Http404
from django.conf import settings
from django.conf.urls import patterns, url
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_control

from rest_framework import status
from rest_framework import permissions
from rest_framework import generics, mixins
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.models import (
    Community, Membership, Entity, Doc, Text, Revision, RefsDecl, Task,
    APIUser, Group, UserMapping, CommunityMapping, Partner, Invitation)
from api.serializers import (
    CommunitySerializer, APIUserSerializer, DocSerializer, EntitySerializer,
    TextSerializer, RevisionSerializer, RefsDeclSerializer, TaskSerializer,
    InvitationSerializer, MembershipSerializer, GroupSerializer,)

from rest_framework.authentication import SessionAuthentication


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
    mixins.ListModelMixin, generics.RetrieveAPIView
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
        if callable(result):
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
            self.pre_save(serializer.object)
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
        data = request.DATA.copy()
        data.update({'doc': self.kwargs['pk']})
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
        data = []
        for doc in membership.community.docs.all():
            children = []
            for page in doc.has_parts():
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
                children.append(child)
            data.append({'title': doc.name, 'key': doc.pk, 'children': children})
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



    def _post_assign(self, request, *args, **kwargs):
        pk_list = map(int, request.POST.getlist('docs[]', []))
        membership = Membership.objects.get(pk=kwargs['pk'])
        doc_pk_list = membership.task_set.values_list('doc_id', flat=True)
        pk_list = [pk for pk in pk_list if pk not in doc_pk_list]
        for doc in Doc.objects.filter(pk__in=pk_list).exclude():
            Task.objects.create(doc=doc, membership=membership)
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
        f = request.FILES['xml']
        try:
            return self.get_response(Text.load_tei(f.read(), self.get_object()))
        except RefsDecl.DoesNotExist, e:
            return HttpResponse(json.dumps({'msg': str(e)}),
                                content_type='application/json',
                                status=404)

    def _post_upload_zip(self, request, *args, **kwargs):
        doc = self.get_object()
        zip_file = request.FILES['zip']
        tmp_zip_path = os.path.join(
            settings.MEDIA_ROOT, str(random.getrandbits(64)))
        os.makedirs(tmp_zip_path, 0755)
        try:
            zip_file = zipfile.ZipFile(zip_file)
            zip_file.extractall(tmp_zip_path)
            file_lst = [
                f for f in os.listdir(tmp_zip_path) if f[0] not in ('.', '_')]
            content_folder = tmp_zip_path
            if len(file_lst) == 1:
                only_file = os.path.join(tmp_zip_path, file_lst[0])
                if os.path.isdir(only_file):
                    content_folder = only_file
            for root, dirs, files in os.walk(content_folder):
                for f in files:
                    src = os.path.join(root, f)
                    dst = os.path.join(root, f.lower())
                    os.rename(src, dst)
            doc.bind_files(content_folder)
            return self.get_response(doc)
        finally:
            shutil.rmtree(tmp_zip_path)

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
        values = {
            'parentOrganizationId': 11888,
            'name': self.object.name,
            'comments': self.object.description
        }
        try:
            values['userId'] = self.request.user.usermapping.mapping_id
        except UserMapping.DoesNotExist:
            pass
        data = urllib.urlencode(values)
        req = urllib2.Request(url, data)
        resp = urllib2.urlopen(req)
        resp_json = json.loads(resp.read())
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
            self.create_liferay_community()
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


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Task
    serializer_class = TaskSerializer


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
