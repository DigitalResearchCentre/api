from django.db.models import Q, query
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, Http404, HttpResponse
from django.conf.urls import patterns, url
from django.views.generic.detail import DetailView
from django.views.decorators.csrf import csrf_exempt

import django_filters
from rest_framework import permissions
from rest_framework import generics, mixins
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from api.models import *
from api.serializers import *

@api_view(['GET'])
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
        if self.response_class is not None:
            return self.response_class(result)
        elif isinstance(result, query.QuerySet):
            self.queryset = result
            return self.list(self.request)
        elif isinstance(result, models.Model):
            serializer = self.get_serializer(result)
            return Response(serializer.data)
        elif isinstance(result, HttpResponse):
            return result
        elif result is None:
            raise Http404
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
            print method
            print self.func
            print self.methods

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

class APIView(RelationView):

    def _post_transcribe(self, request, *args, **kwargs):
        fake = {}
        fake.DATA = dict(request.DATA, doc_id=self.kwargs['pk'])
        fake.FILES = request.FILES
        return generics.CreateAPIView.as_view(
            model=Revision, serializer_class=RevisionSerializer
        )(request, *args, **kwargs)

class CommunityDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Community
    serializer_class = CommunitySerializer

class CommunityList(generics.ListCreateAPIView):
    model = Community
    serializer_class = CommunitySerializer

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
    model = User
    serializer_class = UserSerializer

class UserList(generics.ListCreateAPIView):
    model = User
    serializer_class = UserSerializer

class TranscribeView(generics.CreateAPIView):
    model = Revision
    serializer_class = RevisionSerializer
    permission_classes = (permissions.AllowAny,)
