from base import *
# PARTNER_BASE = 'http://localhost:8080'
# PARTNER_API = PARTNER_BASE + '/textual-community-portlet/api'
# PARTNER_URL = PARTNER_API + '/secure/jsonws/myorganization/'
# PARTNER_SESSION_KEY = '_tc_partner_pk'


DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.mysql',
       'NAME': 'apitest',
       'USER': 'api',
       'PASSWORD': 'api',
   }
}


