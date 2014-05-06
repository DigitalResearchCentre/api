# pre-requirements: python

case "`uname`" in
    'Darwin')
        echo "mac"
        ;;
    'Linux')
        echo "Linux"
        ;;
    *) ;;
esac

if ! which pip; then
    sudo python setup/get-pip.py
fi

if ! which pip; then
    echo "Fail to install pip, please install it manually. \
        (https://pip.pypa.io/en/latest/installing.html#install-pip)"
fi

if ! which virtualenv; then
    sudo pip install -U virtualenv
fi

if ! which virtualenv; then
    echo "Fail to install virtualenv, please install it manually. \
        (https://virtualenv.pypa.io/en/latest/virtualenv.html#installation)"
fi

if [ ! -d venv ]; then
    virtualenv venv
fi

[[ "$VIRTUAL_ENV" == "" ]];. venv/bin/activate
pip install -U pip Pillow MySQL-python django django-treebeard django-cors-headers djangorestframework django-filter celery defusedxml django-tastypie jsonfield django-activity-stream lxml feedparser

# celery worker --app=mycelery -l info

# useradd -M celery
# usermod -L celery
