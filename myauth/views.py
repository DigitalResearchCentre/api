import urllib, urllib2, json, re, uuid
from django.db import IntegrityError
from django import forms
from django.conf import settings
from django.contrib.auth import (
    REDIRECT_FIELD_NAME, authenticate, 
    login as auth_login, logout as auth_logout)
from django.shortcuts import render_to_response
from django.contrib.auth.views import redirect_to_login, login as login_view
from django.contrib.auth.models import User, Group
from django.contrib.auth.forms import UserCreationForm
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.views.generic import (
    UpdateView, View, CreateView, DetailView, TemplateView, FormView)
from api.models import Invitation, UserMapping, APIUser, Community


def login(request, *args, **kwargs):
    partner = request.partner
    if partner and partner.sso_url:
        token = request.GET.get('token')
        if token:
            user = authenticate(partner=partner, token=token)
            if user:
                auth_login(request, user)
            # TODO: what if login failed
            redirect = request.REQUEST.get(REDIRECT_FIELD_NAME, '')
        else:
            redirect = '%s?%s' % (partner.sso_url, urllib.urlencode({
                'redirect': request.build_absolute_uri(), 
                'action': 'login', 
            }))
        return HttpResponseRedirect(redirect)
    #return render_to_response('auth/login.html', {'redirect': redirect})
    return login_view(request, *args, **kwargs)

def logout(request, *args, **kwargs):
    auth_logout(request)
    return HttpResponseRedirect(request.REQUEST.get('next', '/'))

#def sso(request, *args, **kwargs):
#    partner = request.partner
#    action = request.GET.get('action', 'login')
#    token = request.GET.get('token')
#    if action == 'login':
#        if token:
#            user = authenticate(partner=partner, token=token)
#            if user:
#                auth_login(request, user)
#                redirect_to = 'http://localhost:8080/web/textual-community#target='+request.REQUEST.get(REDIRECT_FIELD_NAME, '')
#                return HttpResponseRedirect(redirect_to)
#            # TODO: what if login failed
#        context = {
#            'redirect': '%s?%s' % (partner.sso_url, urllib.urlencode({
#                'redirect': request.build_absolute_uri(), 
#                'action': 'login', 
#            }))
#        }
#        return render_to_response('auth/login.html', context)
#    elif action == 'logout':
#        # this will be a rest call, so no user/partner 
#        return HttpResponse('log out sucess')
#

def invite(request, *args, **kwargs):
    community = request.REQUEST.get('community')
    role_name = request.REQUEST.get('role')
    emails = request.REQUEST.get('emails')
    content = request.REQUEST.get('content')
    data = {'status': 'error'}
    if not (role_name and emails):
        data['msg'] = 'required field missing'
    elif role_name not in ('Co Leader', 'Transcriber'):
        data['msg'] = 'invalid role: %s' % role_name
    else:
        data['status'] = 'success'

    community = Community.objects.get(pk=community)
    invitor = community.get_membership(user=request.user, 
                                       role__name__in=('Leader', 'Co Leader'))
    # TODO: Co Leader can not invite leader
    code = uuid.uuid1().hex
    role = Group.objects.get(name=role_name)
    for email in re.split('\s|[,;]', emails.lower()):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist, e:
            user, created = User.objects.get_or_create(username=email)
            user.email = email
            user.save()
        invitee, created = community.get_or_create_membership(
            user=user, role=role, community_id=community.id)
        if created:
            invitation = Invitation.objects.create(
                    invitor=invitor, invitee=invitee,
                    code=code, email_content=content)
            invitation.send_invitation()
    return HttpResponse(json.dumps(data), content_type="application/json")

def activate(request, *args, **kwargs):
    code = request.GET.get('code')
    user_created = request.GET.get('user_created')
    invitation = Invitation.objects.get(code=code)
    user = invitation.invitee.user
    if not user_created:
        auth_logout(request)

    if not invitation.is_activated() and not user_created:
        try:
            usermapping = user.usermapping
        except UserMapping.DoesNotExist:
            redirect = '%s&%s' % (request.build_absolute_uri(), 
                                  'user_created=created')
            param = urllib.urlencode({'action': 'create', 'redirect': redirect})
            return HttpResponseRedirect(
                    '%s/c/portal/sso?%s' % (settings.PARTNER_BASE, param))

    if not request.user.is_authenticated():
        return redirect_to_login(request.build_absolute_uri())

    if request.user != user:
        # TODO: merge user
        pass
    invitation.activate()
    return HttpResponseRedirect('/client/profile.html')

