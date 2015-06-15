from django.conf import settings
from django.contrib.auth import login as django_login, logout as django_logout 

def login(request, user):
    return django_login(request, user)

def logout(request):
    return django_logout(request)

