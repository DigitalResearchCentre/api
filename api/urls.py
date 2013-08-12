from django.conf.urls import patterns, url, include
from rest_framework import generics, permissions
from api.views import *
from api.models import *
from api.serializers import *

urlpatterns = patterns(
    '',
    url(r'^$', api_root),
    url(r'^communities/$', CommunityList.as_view(), name='community-list'),
    url(r'^communities/(?P<pk>\d+)/', include(APIView.urlpatterns([
        {'serializer_class': CommunitySerializer},
        {'func': 'docs', 'serializer_class': DocSerializer}, 
        {'func': 'entities', 'serializer_class': EntitySerializer}, 
        {'func': 'css', 'serializer_class': CSSSerializer}, 
        {'func': 'info'}, 
        {'func': 'get_refsdecls', 'serializer_class': RefsDeclSerializer}, 
        {'func': 'js', 'serializer_class': JSSerializer},
        {'methods': ['post'], 'func': 'js', 'serializer_class': JSSerializer},
        {'methods': ['post'], 
         'func': 'css', 'serializer_class': CSSSerializer}, 
    ], extra={'model': Community}))), 
    url(r'^docs/$', DocList.as_view(), name='doc-list'),
    url(r'^docs/(?P<pk>\d+)/', include(APIView.urlpatterns([
        {},
        {'func': 'next'}, 
        {'func': 'prev'}, 
        {'func': 'parent'}, 
        {'func': 'has_parts'}, 
        {'func': 'xml'}, 
        {'func': 'xml', 'func_args': '(?P<entity_pk>\d+)'}, 
        {'func': 'has_text_in', 'serializer_class': TextSerializer},
        {'func': 'has_revisions', 'serializer_class': RevisionSerializer},
        {'func': 'cur_revision', 'serializer_class': RevisionSerializer},
        {'func': 'has_entities', 'serializer_class': EntitySerializer},
        {'func': 'has_entities', 'serializer_class': EntitySerializer,
         'func_args': '(?P<entity_pk>\d+)/'},
        {'func': 'has_image', 'serializer_class': TilerImageSerializer},
        {'func': 'has_image', 'serializer_class': TilerImageSerializer,
         'func_args': '(?P<zoom>\d+)/(?P<x>\d+)/(?P<y>\d+)/'},
        {'methods': ['post'],
         'func': 'transcribe', 'serializer_class': RevisionSerializer},
        {'methods': ['put'], 'func': 'publish'},
    ], extra={'model': Doc, 'serializer_class': DocSerializer}))),
    url(r'^entities/$', EntityList.as_view(), name='entity-list'),
    url(r'^entities/(?P<pk>\d+)/', include(APIView.urlpatterns([
        {},
        {'func': 'next'}, 
        {'func': 'prev'}, 
        {'func': 'parent'}, 
        {'func': 'has_parts'}, 
        {'func': 'xml'}, 
        {'func': 'xml', 'func_args': '(?P<doc_pk>\d+)'}, 
        {'func': 'has_text_of', 'serializer_class': TextSerializer}, 
        {'func': 'has_text_of', 'serializer_class': TextSerializer,
         'func_args': '(?P<doc_pk>\d+)/'}, 
        {'func': 'has_docs', 'serializer_class': DocSerializer}, 
        {'func': 'has_docs', 'serializer_class': DocSerializer,
         'func_args': '(?P<doc_pk>\d+)/'}, 
    ], extra={'model': Entity, 'serializer_class': EntitySerializer}))),
    url(r'^texts/$', TextList.as_view(), name='text-list'),
    url(r'^texts/(?P<pk>\d+)/', include(APIView.urlpatterns([
        {},
        {'func': 'next'}, 
        {'func': 'prev'}, 
        {'func': 'parent'}, 
        {'func': 'has_parts'}, 
        {'func': 'is_text_in', 'serializer_class': DocSerializer}, 
        {'func': 'is_text_of', 'serializer_class': EntitySerializer}, 
        {'func': 'xml', 'serializer_class': None}, 
        {'func': 'get_refsdecls', 'serializer_class': RefsDeclSerializer}, 
        {'methods': ['post'], 'func': 'upload_xml'},
    ], extra={'model': Text, 'serializer_class': TextSerializer}))),
    url(r'^users/$', UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>\d+)/$', UserDetail.as_view(), name='user-detail'),
    url(r'^revision/(?P<pk>\d+)/', include(APIView.urlpatterns([
        {'methods': ['post', 'put'], 
         'func': 'commit', 'serializer_class': RevisionSerializer, },
    ], extra={'model': Revision, 'serializer_class': RevisionSerializer}))),
    url(r'^js/(?P<pk>\d+)/', generics.RetrieveUpdateDestroyAPIView.as_view(
        model=JS, serializer_class=JSSerializer, permission_classes=(permissions.AllowAny,))),
    url(r'^test/$', TranscribeView.as_view()),
)



