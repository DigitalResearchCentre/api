import os
import random
import shutil
import zipfile
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
    Community, Membership, Entity, Doc, Text, Revision, RefsDecl,
    APIUser, Group, )
from api.serializers import (
    CommunitySerializer, APIUserSerializer, DocSerializer, EntitySerializer,
    TextSerializer, RevisionSerializer, RefsDeclSerializer, )


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
    @csrf_exempt
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

    def _post_js(self, request, *args, **kwargs):
        data = request.DATA.copy()
        data.update({'community': self.kwargs['pk']})
        return self.create(data=data, files=request.FILES)

    def _post_css(self, request, *args, **kwargs):
        print request.DATA
        return {}

    def _post_upload_tei(self, request, *args, **kwargs):
        f = request.FILES['xml']
        return self.get_response(Text.load_tei(f.read(), self.get_object()))

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

    def post(self, request, *args, **kwargs):
        response = self.create(request, *args, **kwargs)
        if hasattr(self, 'object') and self.object:
            Membership.objects.create(
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


class UserList(generics.ListCreateAPIView):
    model = APIUser
    serializer_class = APIUserSerializer


class TranscribeView(generics.CreateAPIView):
    model = Revision
    serializer_class = RevisionSerializer
    permission_classes = (permissions.AllowAny,)
