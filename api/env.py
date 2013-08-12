DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'api',
        'USER': 'api',
        'PASSWORD': 'api',
        'HOST': '',
        'PORT': '',
    }
}

STATIC_ROOT = '/var/www/static/api/'
STATIC_URL = 'http://textualcommunities.usask.ca/static/api/'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3',
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}


