from django.conf.urls import patterns, include, url
from auth.views import *

urlpatterns = patterns(
    '',
    url(r'^activate$', ActivationView.as_view(), name='activate'),
    url(r'^login/$', login, {
        'template_name': 'auth/login.html'
    }, name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {
        'template_name': 'auth/logout.html'
    }),
)


