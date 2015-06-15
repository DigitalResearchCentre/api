#!/bin/bash

# pre requirements
# python 2.7
# pip: latest
# virtualenv: latest
# rabbitmq: 3.2.3 http://www.rabbitmq.com/
# npm: latest https://www.npmjs.com/
# bower: latest http://bower.io/
# mysql: 5.6

if [ ! -d venv ]; then
    virtualenv venv
fi

[[ "$VIRTUAL_ENV" == "" ]]; source venv/bin/activate
pip install -r requirements.txt
# pip install -U pil MySQL-python  django-cors-headers djangorestframework django-filter celery defusedxml django-tastypie jsonfield django-activity-stream lxml feedparser --allow-external PIL --allow-unverified PIL 

# celery worker --app=mycelery -l info

# useradd -M celery
# usermod -L celery

# CREATE DATABASE apitest CHARACTER SET utf8 COLLATE utf8_bin;
# CREATE USER 'api'@'localhost' IDENTIFIED BY 'api';
# GRANT ALL ON apitest.* TO 'api'@'localhost';
