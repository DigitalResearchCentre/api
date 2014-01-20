from django.conf.urls import patterns, include, url
from mycelery import views

urlpatterns = patterns(
    '', 
    url(r'^(?P<task_id>[\w\d\-]+)/status/?$', 
        views.task_status, name='task-status'),
)


