import urllib, urllib2, json
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from api.models import UserMapping, Invitation

class SSOBackend(ModelBackend):

    def authenticate(self, partner=None, token=None):
        data = urllib.urlencode({
            'token': token,
            'action': 'verify',
        })
        request = urllib2.Request(partner.sso_url, data)
        response = urllib2.urlopen(request)
        data = json.load(response)
        if not all(k in data for k in ('user_id', 'email')):
            return None
        try:
            user = partner.get_user(data['user_id'])
        except UserMapping.DoesNotExist, e:
            email = data['email']
            try:
                user = User.objects.get(username=email)
            except User.DoesNotExist, e:
                user = User.objects.create_user(email, email=data['email'])
                try:
                    invitation = Invitation.objects.get(email=email)
                    invitation.activate()
                except Invitation.DoesNotExist, e:
                    pass
            UserMapping.objects.create(
                partner=partner, user=user, mapping_id=data['user_id']
            )
        user.first_name = data.get('first_name')
        user.last_name = data.get('last_name')
        user.save()
        return user


