from django.conf import settings
from django.contrib.auth import login as django_login, logout as django_logout 

def login(request, user):
    partner_pk = request.session[settings.PARTNER_SESSION_KEY] \
            if settings.PARTNER_SESSION_KEY in request.session \
            else None
    django_login(request, user)
    if partner_pk:
        request.session[settings.PARTNER_SESSION_KEY] = partner_pk

def logout(request):
    partner_pk = request.session[settings.PARTNER_SESSION_KEY] \
            if settings.PARTNER_SESSION_KEY in request.session \
            else None
    django_logout(request)
    if partner_pk:
        request.session[settings.PARTNER_SESSION_KEY] = partner_pk
