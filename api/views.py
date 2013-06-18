from django.db.models import Q, query
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, Http404
from django.views.generic.detail import DetailView

import django_filters
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
        'transcripts': reverse('transcript-list', request=request),
    })

class RelationView(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, generics.GenericAPIView
):

    def get(self, request, 
            model=None, rel=None, serializer_class=None, *args, **kwargs):
        self.model = model
        self.serializer_class = serializer_class
        obj = self.get_object()
        rel = getattr(obj, rel)
        if callable(rel): 
            rel = rel() # TODO: here can support url parameters
        if isinstance(rel, query.QuerySet):
            self.queryset = rel
            return self.list(request, *args, **kwargs)
        elif isinstance(rel, models.Model):
            serializer = self.get_serializer(rel)
            return Response(serializer.data)
        elif isinstance(rel, basestring):
            return Response(rel)
        else:
            raise Http404

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

class TranscriptDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Transcript
    serializer_class = TranscriptSerializer

class TranscriptList(generics.ListCreateAPIView):
    model = Transcript
    serializer_class = TranscriptSerializer


