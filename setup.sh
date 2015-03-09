#!/bin/bash

if [ ! -d venv ]; then
    virtualenv venv
fi

[[ "$VIRTUAL_ENV" == "" ]]; source venv/bin/activate
pip install -r requirements.txt
# pip install -U pil MySQL-python  django-cors-headers djangorestframework django-filter celery defusedxml django-tastypie jsonfield django-activity-stream lxml feedparser --allow-external PIL --allow-unverified PIL 

# celery worker --app=mycelery -l info

# useradd -M celery
# usermod -L celery
