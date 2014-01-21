if ! which virtualenv; then
    pip install virtualenv --upgrade
fi

if [ ! -d venv ]; then
    virtualenv venv
fi

[[ "$VIRTUAL_ENV" == "" ]];. venv/bin/activate
pip install -U pil MySQL-python django django-treebeard django-cors-headers djangorestframework django-filter celery defusedxml django-tastypie django-jsonfield  django-activity-stream
easy_install South

celery worker --app=api -l info
