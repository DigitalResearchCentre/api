from django.conf.urls import patterns, url, include
from api.views import *
from api.models import *
from api.serializers import *

urlpatterns = patterns(
    '',
    url(r'^$', api_root),
    url(r'^communities/$', CommunityList.as_view(), name='community-list'),
    url(r'^communities/(?P<pk>\d+)/', include(APIView.urlpatterns([
        {'func': 'docs', 'serializer_class': DocSerializer}, 
        {'func': 'entities', 'serializer_class': EntitySerializer}, 
    ], extra={'model': Community}))), 
    url(r'^docs/$', DocList.as_view(), name='doc-list'),
    url(r'^docs/(?P<pk>\d+)/', include(APIView.urlpatterns([
        {},
        {'func': 'next'}, 
        {'func': 'prev'}, 
        {'func': 'parent'}, 
        {'func': 'has_parts'}, 
        {'func': 'has_text_in', 'serializer_class': TextSerializer},
        {'func': 'has_revisions', 'serializer_class': RevisionSerializer},
        {'func': 'cur_revision', 'serializer_class': RevisionSerializer},
        {'func': 'has_entities', 'serializer_class': EntitySerializer},
        {'func': 'has_entities', 'serializer_class': EntitySerializer,
         'func_args': '(?P<entity_pk>\d+)/'},
        {'func': 'has_image'},
        {'func': 'has_image', 
         'func_args': '(?P<zoom>\d+)/(?P<x>\d+)/(?P<y>\d+)/'},
        {'methods': ['post'],
         'func': 'transcribe', 'serializer_class': RevisionSerializer },
        {'methods': ['put'], 
         'func': 'commit', 'serializer_class': RevisionSerializer,
         'func_args': '(?P<revision_pk>\d+)/'},
        {'methods': ['put'], 'func': 'publish'},
    ], extra={'model': Doc, 'serializer_class': DocSerializer}))),
    url(r'^entities/$', EntityList.as_view(), name='entity-list'),
    url(r'^entities/(?P<pk>\d+)/', include(APIView.urlpatterns([
        {},
        {'func': 'next'}, 
        {'func': 'prev'}, 
        {'func': 'parent'}, 
        {'func': 'has_parts'}, 
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
    ], extra={'model': Text, 'serializer_class': TextSerializer}))),
    url(r'^users/$', UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>\d+)/$', UserDetail.as_view(), name='user-detail'),
    url(r'^test/$', TranscribeView.as_view()),
)



