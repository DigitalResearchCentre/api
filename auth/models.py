from django.db import models
from django.template import Context, loader
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives

class PartnerMapping(models.Model):
    partner = models.ForeignKey(Partner)
    mapping_id = models.IntegerField(null=False, blank=False)

    class Meta:
        abstract = True
        unique_together = ('partner', 'mapping_id')

class UserMapping(PartnerMapping):
    user = models.OneToOneField(User)

    class Meta:
        db_table = 'community_usermapping'

    def __unicode__(self):
        return u'%s %s %s'  % (self.user, self.partner, self.mapping_id)


class Invitation(models.Model):
    invitor = models.ForeignKey(Membership, related_name='+')
    invitee = models.OneToOneField(Membership)
    email = models.EmailField()
    email_content = models.TextField(blank=True)
    code = models.CharField(max_length=32, db_index=True)
    invited_date = models.DateTimeField(auto_now_add=True)
    accepted_date = models.DateTimeField(blank=True, null=True)

    def __unicode__(self):
        return unicode('%s %s' % (self.invitee, self.email))

    def activate(self):
        if self.accepted_date != None:
            return
        user = User.objects.get(email=self.email)
        try:
            # if user grant membership from other place,
            # or active use othe email, we won't duplicate his membership
            membership = user.membership_set.get(
                community=self.invitee.community, role=self.invitee.role
            )
            # TODO: need figure out
            #self.invitee = membership
            self.invitee.task_set.update(member=membership)
            self.invitee.delete()
            self.delete()
            return
        except Membership.DoesNotExist, e:
            self.invitee.user = user
            self.invitee.save()
        self.accepted_date = datetime.now()
        self.save()

    def invite_url(self):
        return '%s%s?code=%s&partner=1' % (
            settings.BASE_URL, reverse('auth:activate'), self.code
        )

    def sent_invitation(self):
        subject = 'Welcome to %s' % self.invitee.community.name
        recipient_list = [self.email]
        data = {'invitation': self}
        try:
            user = User.objects.get(email=self.email)
            self.activate()
            data['user'] = user
        except User.DoesNotExist, e:
            pass
        context = Context(data)
        html_template = loader.get_template('community/invitation.html')
        text_template = loader.get_template('community/invitation.txt')
        # TODO: exception handle
        # errno 61, Connection refused
        mail_msg = EmailMultiAlternatives(
            subject, text_template.render(context), 
            settings.FROM_EMAIL, recipient_list
        )
        mail_msg.attach_alternative(html_template.render(context), 'text/html')
        mail_msg.send()


