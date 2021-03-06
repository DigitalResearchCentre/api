import os
ROOT_PATH = os.path.dirname(os.path.abspath(__file__))

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ['*']

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Canada/Saskatchewan'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(ROOT_PATH, '..', 'client'),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    #'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
# SECRET_KEY = '_ujy=^4gs45_@!807ra4oh%(ced=+0lepk$g=u)i0(qk@%ruuk'
SECRET_KEY = ')*b#9)mb6n5jfpp1=xdx_4$^u7i(eb$&amp;uhuj%=%8ivtb@3+&amp;ba'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    #'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    #'api.middleware.QueryLogMiddleware',
    'api.middleware.PartnerMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'api.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'api.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates"
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',

    'rest_framework',
    'corsheaders',
    'treebeard',

    #'hierarchy',
    'api',
    'myauth',
    'regularize',
    'mycelery',
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'myauth.backends.SSOBackend',
)

REST_FRAMEWORK = {
    'FILTER_BACKEND': 'rest_framework.filters.DjangoFilterBackend',
    'PAGINATE_BY': 0,
    'PAGINATE_BY_PARAM': 'page_size',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'FORM_METHOD_OVERRIDE': None,
}

CORS_ORIGIN_ALLOW_ALL = True

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

TASTYPIE_DEFAULT_FORMATS = ['json', 'xml']

############################## custom settings ##############################
DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.mysql',
       'NAME': 'api',
       'USER': 'api',
       'PASSWORD': 'api',
   }
}

BASE_URL = 'http://localhost:8000/'

STATIC_ROOT = os.path.join(ROOT_PATH, 'static')
STATIC_URL = '/static/'
MEDIA_ROOT = os.path.join(ROOT_PATH, 'static', 'media')
MEDIA_URL = '/static/media/'


LOGIN_REDIRECT_URL = '/auth/'
FROM_EMAIL = 'noreply@textualcommunities.usask.ca'
PARTNER_BASE = 'http://localhost:8080'
PARTNER_API = PARTNER_BASE + '/textual-community-portlet/api'
PARTNER_URL = PARTNER_API + '/secure/jsonws/myorganization/'

PARTNER_SESSION_KEY = '_tc_partner_pk'

EMAIL_HOST = 'localhost'
EMAIL_PORT = '1025'

BROKER_URL = 'django://'

CELERY_TRACK_STARTED = True

#PARTNER_BASE = 'http://www.textualcommunities.usask.ca/'
#PARTNER_API = PARTNER_BASE + '/textual-community-portlet/api'
#PARTNER_URL = PARTNER_API + '/secure/jsonws/myorganization/'

COLLATEX_ENDPOINT = 'http://localhost:7369/'
COLLATE_URL = COLLATEX_ENDPOINT + 'collate'

try:
    from env import *
except ImportError, e:
    print e
