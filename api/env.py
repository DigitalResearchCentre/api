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
