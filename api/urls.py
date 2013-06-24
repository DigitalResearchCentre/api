from django.conf.urls import patterns, url
from api.views import *
from api.models import *
from api.serializers import *

urlpatterns = patterns(
    '',
    url(r'^$', api_root),
    url(r'communities/$', CommunityList.as_view(), name='community-list'),
    url(r'communities/(?P<pk>\d+)/$', 
        CommunityDetail.as_view(), name='community-detail'),
    url(r'communities/(?P<pk>\d+)/docs/$', RelationView.as_view(), {
        'model': Community, 'rel': 'get_docs', 
        'serializer_class': DocSerializer
    }),
    url(r'communities/(?P<pk>\d+)/entities/$', RelationView.as_view(), {
        'model': Community, 'rel': 'get_entities',
        'serializer_class': EntitySerializer
    }),
    url(r'docs/$', DocList.as_view(), name='doc-list'),
    url(r'docs/(?P<pk>\d+)/$', DocDetail.as_view(), name='doc-detail'),
    url(r'docs/(?P<pk>\d+)/next$', RelationView.as_view(), {
        'model': Doc, 'rel': 'next',
        'serializer_class': DocSerializer
    }),
    url(r'docs/(?P<pk>\d+)/prev$', RelationView.as_view(), {
        'model': Doc, 'rel': 'prev',
        'serializer_class': DocSerializer
    }),
    url(r'docs/(?P<pk>\d+)/parent$', RelationView.as_view(), {
        'model': Doc, 'rel': 'parent',
        'serializer_class': DocSerializer
    }),
    url(r'docs/(?P<pk>\d+)/has_parts$', RelationView.as_view(), {
        'model': Doc, 'rel': 'has_parts',
        'serializer_class': DocSerializer
    }),
    url(r'docs/(?P<pk>\d+)/has_text_in$', RelationView.as_view(), {
        'model': Doc, 'rel': 'has_text_in',
        'serializer_class': TextSerializer
    }),
    url(r'docs/(?P<pk>\d+)/has_entities_in$', RelationView.as_view(), {
        'model': Doc, 'rel': 'has_entities_in',
        'serializer_class': EntitySerializer
    }),
    url(r'docs/(?P<pk>\d+)/has_image/$', fake_image),
    url(r'docs/(?P<pk>\d+)/has_image/(?P<zoom>\d+)/(?P<x>\d+)/(?P<y>\d+)/$', fake_image),
    url(r'entities/$', EntityList.as_view(), name='entity-list'),
    url(r'entities/(?P<pk>\d+)/$', 
        EntityDetail.as_view(), name='entity-detail'),
    url(r'entities/(?P<pk>\d+)/next$', RelationView.as_view(), {
        'model': Entity, 'rel': 'next',
        'serializer_class': EntitySerializer
    }),
    url(r'entities/(?P<pk>\d+)/prev$', RelationView.as_view(), {
        'model': Entity, 'rel': 'prev',
        'serializer_class': EntitySerializer
    }),
    url(r'entities/(?P<pk>\d+)/parent$', RelationView.as_view(), {
        'model': Entity, 'rel': 'parent',
        'serializer_class': EntitySerializer
    }),
    url(r'entities/(?P<pk>\d+)/has_parts$', RelationView.as_view(), {
        'model': Entity, 'rel': 'has_parts',
        'serializer_class': EntitySerializer
    }),
    url(r'entities/(?P<pk>\d+)/has_text_of$', RelationView.as_view(), {
        'model': Entity, 'rel': 'has_text_of',
        'serializer_class': TextSerializer
    }),   
    url(r'texts/$', TextList.as_view(), name='text-list'),
    url(r'texts/(?P<pk>\d+)/$', TextDetail.as_view(), name='text-detail'),
    url(r'texts/(?P<pk>\d+)/next$', RelationView.as_view(), {
        'model': Text, 'rel': 'next',
        'serializer_class': TextSerializer
    }),
    url(r'texts/(?P<pk>\d+)/prev$', RelationView.as_view(), {
        'model': Text, 'rel': 'prev',
        'serializer_class': TextSerializer
    }),
    url(r'texts/(?P<pk>\d+)/parent$', RelationView.as_view(), {
        'model': Text, 'rel': 'parent',
        'serializer_class': TextSerializer
    }),
    url(r'texts/(?P<pk>\d+)/has_parts$', RelationView.as_view(), {
        'model': Text, 'rel': 'has_parts',
        'serializer_class': TextSerializer
    }),
    url(r'texts/(?P<pk>\d+)/is_text_in$', RelationView.as_view(), {
        'model': Text, 'rel': 'is_text_in',
        'serializer_class': DocSerializer
    }),
    url(r'texts/(?P<pk>\d+)/is_text_of$', RelationView.as_view(), {
        'model': Text, 'rel': 'is_text_of',
        'serializer_class': EntitySerializer
    }),
    url(r'texts/(?P<pk>\d+)/xml$', RelationView.as_view(), {
        'model': Text, 'rel': 'xml',
    }),

    url(r'users/$', UserList.as_view(), name='user-list'),
    url(r'users/(?P<pk>\d+)/$', UserDetail.as_view(), name='user-detail'),
    url(r'transcripts/$', TranscriptList.as_view(), name='transcript-list'),
    url(r'transcripts/(?P<pk>\d+)/$', 
        TranscriptDetail.as_view(), name='transcript-detail'),
)

