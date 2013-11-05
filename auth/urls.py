from django.conf.urls import patterns, include, url
from auth.views import *

urlpatterns = patterns(
    '',
    url(r'^activate/$', activate, name='activate'),
    url(r'^invite/$', invite),
    url(r'^login/$', login, {'template_name': 'auth/login.html'}, name='login'),
    url(r'^logout/$', logout, {'template_name': 'auth/logout.html'}),
)


