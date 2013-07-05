from django.conf.urls import patterns, url, include
from api.views import *
from api.models import *
from api.serializers import *

urlpatterns = patterns(
    '',
    url(r'^$', api_root),
    url(r'^communities/$', CommunityList.as_view(), name='community-list'),
    url(r'^communities/(?P<pk>\d+)/$', 
        CommunityDetail.as_view(), name='community-detail'),
    url(r'^communities/(?P<pk>\d+)/docs/$', RelationView.as_view(), {
        'model': Community, 'rel': 'get_docs', 
        'serializer_class': DocSerializer
    }),
    url(r'^communities/(?P<pk>\d+)/entities/$', RelationView.as_view(), {
        'model': Community, 'rel': 'get_entities',
        'serializer_class': EntitySerializer
    }),
    url(r'^docs/$', DocList.as_view(), name='doc-list'),
    url(r'^docs/(?P<pk>\d+)/', include(
        APIView.urlpatterns([
            {'serializer_class': DocSerializer},
            {'func': 'has_text_in', 'serializer_class': TextSerializer},
            {'func': 'next', 'serializer_class': DocSerializer},
            {'func': 'prev', 'serializer_class': DocSerializer},
            {'func': 'parent', 'serializer_class': DocSerializer},
            {'func': 'has_parts', 'serializer_class': DocSerializer},
            {'func': 'has_revisions', 'serializer_class': RevisionSerializer},
            {'func': 'cur_revision', 'serializer_class': RevisionSerializer},
            {'func': 'has_entities', 'serializer_class': EntitySerializer},
            {'func': 'has_entities', 'serializer_class': EntitySerializer,
             'func_args': '/has_entities/(?P<entity_pk>\d+)'},
            {'func': 'has_image', 'serializer_class': TilerImageSerializer},
            {'func': 'has_image', 
             'func_args': '/(?P<zoom>\d+)/(?P<x>\d+)/(?P<y>\d+)'},
            {'func': 'transcribe', 'serializer_class': RevisionSerializer,
             'methods': ['post']},
            {'func': 'commit', 'serializer_class': RevisionSerializer,
             'func_args': '/(?P<revision_pk>\d+)', 'methods': ['put']},
            {'func': 'publish', 'serializer_class': DocSerializer, },
        ], extra={'model': Doc})
    )),
    url(r'^entities/$', EntityList.as_view(), name='entity-list'),
    url(r'^entities/(?P<pk>\d+)/$', 
        EntityDetail.as_view(), name='entity-detail'),
    url(r'^entities/(?P<pk>\d+)/next$', RelationView.as_view(), {
        'model': Entity, 'rel': 'next',
        'serializer_class': EntitySerializer
    }),
    url(r'^entities/(?P<pk>\d+)/prev/$', RelationView.as_view(), {
        'model': Entity, 'rel': 'prev',
        'serializer_class': EntitySerializer
    }),
    url(r'^entities/(?P<pk>\d+)/parent/$', RelationView.as_view(), {
        'model': Entity, 'rel': 'parent',
        'serializer_class': EntitySerializer
    }),
    url(r'^entities/(?P<pk>\d+)/has_parts/$', RelationView.as_view(), {
        'model': Entity, 'rel': 'has_parts',
        'serializer_class': EntitySerializer
    }),
    url(r'^entities/(?P<pk>\d+)/has_text_of/$', RelationView.as_view(), {
        'model': Entity, 'rel': 'has_text_of',
        'serializer_class': TextSerializer
    }),   
    url(r'^entities/(?P<pk>\d+)/has_text_of/(?P<doc_pk>\d+)/$', 
        RelationView.as_view(), {
            'model': Entity, 'rel': 'has_text_of',
            'serializer_class': TextSerializer,
            'url_args': ['doc_pk'],
        }),   
    url(r'^entities/(?P<pk>\d+)/urn/$', RelationView.as_view(), {
        'model': Entity, 'rel': 'get_urn',
    }),
    url(r'^entities/(?P<pk>\d+)/has_docs/$', RelationView.as_view(), {
        'model': Entity, 'rel': 'has_docs', 'serializer_class': DocSerializer
    }),
    url(r'^entities/(?P<pk>\d+)/has_docs/(?P<doc_pk>\d+)/$', 
        RelationView.as_view(), {
            'model': Entity, 'rel': 'has_docs', 
            'serializer_class': DocSerializer,
            'url_args': ['doc_pk'],
        }),
    url(r'^texts/$', TextList.as_view(), name='text-list'),
    url(r'^texts/(?P<pk>\d+)/$', TextDetail.as_view(), name='text-detail'),
    url(r'^texts/(?P<pk>\d+)/next/$', RelationView.as_view(), {
        'model': Text, 'rel': 'next',
        'serializer_class': TextSerializer
    }),
    url(r'^texts/(?P<pk>\d+)/prev/$', RelationView.as_view(), {
        'model': Text, 'rel': 'prev',
        'serializer_class': TextSerializer
    }),
    url(r'^texts/(?P<pk>\d+)/parent/$', RelationView.as_view(), {
        'model': Text, 'rel': 'parent',
        'serializer_class': TextSerializer
    }),
    url(r'^texts/(?P<pk>\d+)/has_parts/$', RelationView.as_view(), {
        'model': Text, 'rel': 'has_parts',
        'serializer_class': TextSerializer
    }),
    url(r'^texts/(?P<pk>\d+)/is_text_in/$', RelationView.as_view(), {
        'model': Text, 'rel': 'is_text_in',
        'serializer_class': DocSerializer
    }),
    url(r'^texts/(?P<pk>\d+)/is_text_of/$', RelationView.as_view(), {
        'model': Text, 'rel': 'is_text_of',
        'serializer_class': EntitySerializer
    }),
    url(r'^texts/(?P<pk>\d+)/xml/$', RelationView.as_view(), {
        'model': Text, 'rel': 'xml',
    }),
    url(r'^texts/(?P<pk>\d+)/urn/$', RelationView.as_view(), {
        'model': Text, 'rel': 'get_urn',
    }),

    url(r'^users/$', UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>\d+)/$', UserDetail.as_view(), name='user-detail'),
)



#{
#  community_list: {
#    list: 'communities/$',
#    single_object: 'communities/(?P<pk>\d+)/$',
#    docs: 'communities/(?P<pk>\d+)/docs/$',
#    entities: 'communities/(?P<pk>\d+)/entities/$',
#  },
#  doc: {
#    list: 'docs/$',
#    single_object: 'docs/(?P<pk>\d+)/$',
#    next: 'docs/(?P<pk>\d+)/next/$',
#    prev: 'docs/(?P<pk>\d+)/prev/$',
#    parent: 'docs/(?P<pk>\d+)/parent/$',
#    has_parts: 'docs/(?P<pk>\d+)/has_parts/$',
#    has_entities_in: 'docs/(?P<pk>\d+)/has_entities_in/$',
#    has_text_in: 'docs/(?P<pk>\d+)/has_text_in/$',
#  },
#  entity: {
#    list: 'entities/$',
#    single_object: 'entities/(?P<pk>\d+)/$',
#    next: 'entities/(?P<pk>\d+)/next/$',
#    prev: 'entities/(?P<pk>\d+)/prev/$',
#    parent: 'entities/(?P<pk>\d+)/parent/$',
#    has_parts: 'entities/(?P<pk>\d+)/has_parts/$',
#    has_text_of: 'entities/(?P<pk>\d+)/has_text_of/$',
#  },
#  text: {
#    list: 'texts/$',
#    single_object: 'texts/(?P<pk>\d+)/$',
#    next: 'texts/(?P<pk>\d+)/next/$',
#    prev: 'texts/(?P<pk>\d+)/prev/$',
#    parent: 'texts/(?P<pk>\d+)/parent/$',
#    has_parts: 'texts/(?P<pk>\d+)/has_parts/$',
#    is_text_in: 'texts/(?P<pk>\d+)/is_text_in/$',
#    is_text_of: 'texts/(?P<pk>\d+)/is_text_of/$',
#    xml: 'texts/(?P<pk>\d+)/xml/$',
#  },
#  user: {
#    list: 'users/$',
#    single_object: 'users/(?P<pk>\d+)/$',
#  }
#}
#
