from django.conf import settings
from django.conf.urls import patterns, url, include
from django.contrib import admin
from rest_framework import generics
from api.models import (
    Community, Entity, Doc, Text, Revision, APIUser, JS, Partner, Schema, CSS,
    Membership,)
from api.serializers import (
    CommunitySerializer, APIUserSerializer, DocSerializer, EntitySerializer,
    TextSerializer, RevisionSerializer, RefsDeclSerializer, TaskSerializer,
    MembershipSerializer, CSSSerializer, JSSerializer, TilerImageSerializer,
    SchemaSerializer, MemberSerializer)
from api.views import (
    api_root, CommunityList, CommunityDetail, APIView, DocList,
    EntityList, TextDetail, TextList, UserList, UserDetail, RefsDeclList,
    RefsDeclDetail, UserInfo, DocDetail, MembershipDetail, MembershipList,
    RoleDetail, TaskDetail, )
from django.conf.urls.static import static
from api.resource import v1_api

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^$', api_root),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^communities/$', CommunityList.as_view(), name='community-list'),
    url(r'^communities/(?P<pk>\d+)/$', CommunityDetail.as_view()),
    url(r'^communities/(?P<pk>\d+)/',
        include(APIView.urlpatterns([
            {'methods': ['get', 'post'], 'func': 'xmlvalidate'},
            {'func': 'docs', 'serializer_class': DocSerializer},
            {'func': 'entities', 'serializer_class': EntitySerializer},
            {'func': 'css', 'serializer_class': CSSSerializer},
            {'func': 'info'},
            {'func': 'friendly_url'},
            {'func': 'get_refsdecls', 'serializer_class': RefsDeclSerializer},
            {'func': 'js', 'serializer_class': JSSerializer},
            {'func': 'schema', 'serializer_class': SchemaSerializer},
            {'func': 'memberships', 'serializer_class': MemberSerializer},
            {
                'methods': ['post'], 'func': 'add_refsdecl',
                'func_args': '(?P<refsdecl_pk>\d+)',
                'serializer_class': RefsDeclSerializer
            }, {
                'methods': ['post'], 'func': 'schema',
                'serializer_class': SchemaSerializer
            }, {
                'methods': ['post'], 'func': 'js',
                'serializer_class': JSSerializer
            }, {
                'methods': ['post'], 'func': 'css',
                'serializer_class': CSSSerializer
            }, {
                'methods': ['post'], 'func': 'upload_tei',
                'serializer_class': TextSerializer
            },
        ], extra={'model': Community}))),
    url(r'^docs/$', DocList.as_view(), name='doc-list'),
    url(r'^docs/(?P<pk>\d+)/$', DocDetail.as_view()),
    url(r'^docs/(?P<pk>\d+)/',
        include(APIView.urlpatterns([
            {'func': 'next'},
            {'func': 'prev'},
            {'func': 'parent'},
            {'func': 'has_parts'},
            {'func': 'get_urn'},
            {'func': 'xml'},
            {'func': 'xml', 'func_args': '(?P<entity_pk>\d+)'},
            {'func': 'has_text_in', 'serializer_class': TextSerializer},
            {'func': 'has_revisions', 'serializer_class': RevisionSerializer},
            {'func': 'cur_revision', 'serializer_class': RevisionSerializer},
            {'func': 'has_entities', 'serializer_class': EntitySerializer},
            {'func': 'has_image', 'serializer_class': TilerImageSerializer},
            {
                'func': 'has_image',
                'serializer_class': TilerImageSerializer,
                'func_args': '(?P<zoom>\d+)/(?P<x>\d+)/(?P<y>\d+)/'
            }, {
                'func': 'has_entities', 'serializer_class': EntitySerializer,
                'func_args': '(?P<entity_pk>\d+)/'
            }, {
                'methods': ['post'], 'func': 'transcribe',
                'serializer_class': RevisionSerializer
            },
            {'methods': ['post'], 'func': 'upload_zip'},
            {'methods': ['put'], 'func': 'publish'},
        ], extra={'model': Doc, 'serializer_class': DocSerializer}))),
    url(r'^entities/$', EntityList.as_view(), name='entity-list'),
    url(r'^entities/(?P<pk>\d+)/',
        include(APIView.urlpatterns([
            {},
            {'func': 'next'},
            {'func': 'prev'},
            {'func': 'parent'},
            {'func': 'has_parts'},
            {'func': 'xml'},
            {'func': 'xml', 'func_args': '(?P<doc_pk>\d+)/'},
            {'func': 'has_text_of', 'serializer_class': TextSerializer},
            {
                'func': 'has_text_of', 'serializer_class': TextSerializer,
                'func_args': '(?P<doc_pk>\d+)/'
            }, {
                'func': 'has_docs', 'serializer_class': DocSerializer,
                'func_args': '(?P<doc_pk>\d+)/'
            },
            {'func': 'has_docs', 'serializer_class': DocSerializer},
        ], extra={'model': Entity, 'serializer_class': EntitySerializer}))),
    url(r'^texts/$', TextList.as_view(), name='text-list'),
    url(r'^texts/(?P<pk>\d+)/$', TextDetail.as_view()),
    url(r'^texts/(?P<pk>\d+)/',
        include(APIView.urlpatterns([
            {},
            {'func': 'next'},
            {'func': 'prev'},
            {'func': 'parent'},
            {'func': 'has_parts'},
            {'func': 'is_text_in', 'serializer_class': DocSerializer},
            {'func': 'is_text_of', 'serializer_class': EntitySerializer},
            {'func': 'xml', 'serializer_class': None},
            {'func': 'get_refsdecls', 'serializer_class': RefsDeclSerializer},
        ], extra={'model': Text, 'serializer_class': TextSerializer}))),
    url(r'^users/$', UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>\d+)/$', UserDetail.as_view(), name='user-detail'),
    url(r'^users/(?P<pk>\d+)/',
        include(APIView.urlpatterns([
            {'func': 'communities', 'serializer_class': CommunitySerializer},
            {'func': 'can_edit', 'func_args': '(?P<doc_pk>\d+)/'},
            {
                'func': 'memberships',
                'serializer_class': MembershipSerializer
            }, {
                'func': 'memberships', 'func_args': '(?P<community_pk>\d+)/',
                'serializer_class': MembershipSerializer,
            },
        ], extra={'model': APIUser, 'serializer_class': APIUserSerializer}))),
    url(r'^tasks/(?P<pk>\d+)/$', TaskDetail.as_view()),
    url(r'^memberships/$', MembershipList.as_view()),
    url(r'^memberships/(?P<pk>\d+)/$', MembershipDetail.as_view()),
    url(r'^memberships/(?P<pk>\d+)/',
        include(APIView.urlpatterns([
            {'func': 'tasks', 'serializer_class': TaskSerializer},
            {'func': 'has_task', 'func_args': '(?P<doc_pk>\d+)/'},
            {'func': 'assign'},
        ], extra={
            'model': Membership, 'serializer_class': MembershipSerializer
        }))),
    url(r'^roles/(?P<pk>\d+)/$', RoleDetail.as_view()),
    url(r'^revision/(?P<pk>\d+)/',
        include(APIView.urlpatterns([
            {}, {
                'methods': ['post', 'put'],
                'func': 'commit', 'serializer_class': RevisionSerializer,
            },
        ], extra={
            'model': Revision, 'serializer_class': RevisionSerializer
        }))),
    url(r'^partner/(?P<pk>\d+)/',
        include(APIView.urlpatterns([{
            'func': 'get_community', 'func_args': '(?P<mapping_id>\d+)/',
            'serializer_class': CommunitySerializer,
        }, ], extra={'model': Partner}))),
    url(r'^js/(?P<pk>\d+)/',
        generics.RetrieveUpdateDestroyAPIView.as_view(
            model=JS, serializer_class=JSSerializer,)),
    url(r'^css/(?P<pk>\d+)/',
        generics.RetrieveUpdateDestroyAPIView.as_view(
            model=CSS, serializer_class=CSSSerializer,)),
    url(r'^schema/(?P<pk>\d+)/',
        generics.RetrieveUpdateDestroyAPIView.as_view(
            model=Schema, serializer_class=SchemaSerializer,)),
    url(r'^refsdecl/$', RefsDeclList.as_view()),
    url(r'^refsdecl/(?P<pk>\d+)/$', RefsDeclDetail.as_view()),
    url(r'^auth/$', UserInfo.as_view()),
    url(r'^auth/', include('auth.urls', namespace='auth')),
    #url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
) + v1_api.urls

if settings.DEBUG:
    urlpatterns += static('/client', document_root=settings.CLIENT_ROOT)

