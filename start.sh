#!/bin/bash


celery worker --app=mycelery -l info &
python manage.py runserver


