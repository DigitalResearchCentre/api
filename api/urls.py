from django.conf.urls import patterns, url
from api.views import *

urlpatterns = patterns('',
    url(r'^$', api_root),
    url(r'communities/$', CommunityList.as_view(), name='community-list'),
    url(r'communities/(?P<pk>\d+)/$', 
        CommunityDetail.as_view(), name='community-detail'),
    url(r'docs/$', DocList.as_view(), name='doc-list'),
    url(r'docs/(?P<pk>\d+)/$', DocDetail.as_view(), name='doc-detail'),
    url(r'entities/$', EntityList.as_view(), name='entity-list'),
    url(r'entities/(?P<pk>\d+)/$', 
        EntityDetail.as_view(), name='entity-detail'),
    url(r'texts/$', TextList.as_view(), name='text-list'),
    url(r'texts/(?P<pk>\d+)/$', TextDetail.as_view(), name='text-detail'),
    url(r'users/$', UserList.as_view(), name='user-list'),
    url(r'users/(?P<pk>\d+)/$', UserDetail.as_view(), name='user-detail'),
    url(r'transcripts/$', TranscriptList.as_view(), name='transcript-list'),
    url(r'transcripts/(?P<pk>\d+)/$', 
        TranscriptDetail.as_view(), name='transcript-detail'),
)

