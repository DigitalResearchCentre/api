#!/bin/bash

ROOT_DIR=$(cd $(dirname "$0"); pwd)
cd $ROOT_DIR

# pre-requirements: 
#   python 
#   mysql
#   rabbitmq    http://www.rabbitmq.com/download.html
#   bower       http://bower.io/

if ! which pip; then
    sudo python setup/get-pip.py
fi

if ! which pip; then
    echo "Fail to install pip, please install it manually. \
        (https://pip.pypa.io/en/latest/installing.html#install-pip)"
    exit
fi

if ! which virtualenv; then
    sudo pip install -U virtualenv
fi

if ! which virtualenv; then
    echo "Fail to install virtualenv, please install it manually. \
        (https://virtualenv.pypa.io/en/latest/virtualenv.html#installation)"
    exit
fi

if [ ! -d venv ]; then
    virtualenv venv
fi

[[ "$VIRTUAL_ENV" == "" ]];. venv/bin/activate
pip install -U pip 
pip install -U django django-treebeard django-cors-headers djangorestframework django-filter celery==3.1.9 defusedxml django-tastypie jsonfield django-activity-stream feedparser MySQL-python
#mysql-connector-python --allow-external mysql-connector-python
ARCHFLAGS=-Wno-error=unused-command-line-argument-hard-error-in-future pip install -U Pillow lxml

cd client
bower install

# CREATE DATABASE grubstreet CHARACTER SET utf8 COLLATE utf8_bin;
# celery worker --app=mycelery -l info
