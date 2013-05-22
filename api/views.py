from rest_framework import generics
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from django.contrib.auth.models import User
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

class CommunityDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Community
    serializer_class = CommunitySerializer

class CommunityList(generics.ListCreateAPIView):
    model = Community
    serializer_class = CommunitySerializer

class DocDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Doc
    serializer_class = DocSerializer

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




