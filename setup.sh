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
cd client
bower install

# First Time setup:
# CREATE DATABASE apitest CHARACTER SET utf8 COLLATE utf8_bin;
# CREATE USER 'api'@'localhost' IDENTIFIED BY 'api';
# GRANT ALL ON apitest.* TO 'api'@'localhost';


# command for running local server:
# python manage.py runserver &
# celery worker --app=mycelery -l info &

# restorecon -R -v api
# cd venv/lib/python2.7/site-packages
# find . -name "*.so" -exec chcon -R -h -t httpd_sys_script_exec_t {} \;
