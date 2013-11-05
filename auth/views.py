import urllib, urllib2, json
from django import forms
from django.conf import settings
from django.contrib.auth import REDIRECT_FIELD_NAME, authenticate
from django.shortcuts import render_to_response
from django.contrib.auth.views import redirect_to_login, login as login_view
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.views.generic import (
    UpdateView, View, CreateView, DetailView, TemplateView, FormView)
from auth import login as auth_login, logout as auth_logout
from api.models import Invitation, CommunityMapping

def login(request, *args, **kwargs):
    partner = request.partner
    if partner and partner.sso_url:
        token = request.GET.get('token')
        if token:
            user = authenticate(partner=partner, token=token)
            if user:
                auth_login(request, user)
                redirect_to = '%s#%s' % (
                    '%s/web/textual-community' % settings.PARTNER_BASE,
                    urllib.urlencode({ 
                        'target': request.REQUEST.get(REDIRECT_FIELD_NAME, '')
                    })
                )
                return HttpResponseRedirect(redirect_to)
            # TODO: what if login failed
        context = {
            'redirect': '%s?%s' % (partner.sso_url, urllib.urlencode({
                'redirect': request.build_absolute_uri(), 
                'action': 'login', 
            }))
        }
        return render_to_response('auth/login.html', context)
    return login_view(request, *args, **kwargs)
# TODO: sso logout not work yet

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

def invite(request):
    community = request.REQUEST.get('community')
    role = request.REQUEST.get('role')
    emails = request.REQUEST.get('emails')
    return HttpResponse('hello')

class MyUserCreationForm(UserCreationForm):
    first_name = forms.CharField(max_length=30)
    last_name = forms.CharField(max_length=30)

class ActivationView(FormView):
    form_class = MyUserCreationForm
    template_name = 'auth/activate.html'

    def get(self, request, *args, **kwargs):
        code = request.GET.get('code')
        user_created = request.GET.get('user_created')
        invitation = Invitation.objects.get(code=code)
        qs = User.objects.filter(email=invitation.email)
        if not qs.exists() and not user_created:
            # TODO: what if created fail ?
            auth_logout(request)
            return HttpResponseRedirect(
                '%s/c/portal/sso?%s' % (
                    settings.PARTNER_BASE,
                    urllib.urlencode({
                        'action': 'create', 
                        'redirect': '%s&%s' % ( 
                            request.build_absolute_uri(), 
                            'user_created=created'
                        )
                    })
                )
            )

        # TODO: is user login here?
        if not request.user.is_authenticated():
            return redirect_to_login(request.build_absolute_uri())

        if invitation.email != request.user.email:
            invitation.email = request.user.email
            invitation.save()
        invitation.activate()
        #TODO: change to profile view
        return HttpResponseRedirect(
            reverse('community:profile', args=[invitation.invitee.community.pk])
        )


    def get_success_url(self):
        return '%s?code=%s' % (
            reverse('auth:activate'), self.request.GET.get('code')
        )

    def form_valid(self, form):
        code = self.request.GET.get('code')
        invitation = Invitation.objects.get(code=code)
        try:
            user = User.objects.get(email=invitation.email)
        except User.DoesNotExist:
            user = form.save()
            user.email = invitation.email
            user.first_name = form.cleaned_data['first_name']
            user.last_name = form.cleaned_data['last_name']
            user.save()
            url = settings.PARTNER_ADD_USER_URL
            community_mapping = CommunityMapping.objects.get(
                community=invitation.invitee.community
            )
            values = {
                'creatorUserId': '10196',
                'password': form.cleaned_data['password1'],
                'username': user.username,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'organizationId': community_mapping.mapping_id
            }
            data = urllib.urlencode(values)
            req = urllib2.Request(settings.PARTNER_ADD_USER_URL, data)
            try:
                resp = urllib2.urlopen(req)
            except urllib2.URLError, e:
                # TODO
                print e
        invitation.activate()
        if user.email != invitation.email:
            auth_logout(self.request)
        return redirect_to_login(self.get_success_url())


