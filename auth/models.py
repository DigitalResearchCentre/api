from django.db import models
from django.template import Context, loader
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives

class Partner(models.Model):
    name = models.CharField(max_length=80, unique=True, db_index=True)
    sso_url = models.URLField()

    def __unicode__(self):
        return unicode(self.name)

    def get_community(self, mapping_id):
        return self.communitymapping_set.get(mapping_id=mapping_id).community

    def get_user(self, mapping_id):
        return self.usermapping_set.get(mapping_id=mapping_id).user

class PartnerMapping(models.Model):
    partner = models.ForeignKey(Partner)
    mapping_id = models.IntegerField(null=False, blank=False)

    class Meta:
        abstract = True
        unique_together = ('partner', 'mapping_id')
        db_table = 'community_partnermapping'

class UserMapping(PartnerMapping):
    user = models.OneToOneField(User)

    class Meta:
        db_table = 'community_usermapping'

    def __unicode__(self):
        return u'%s %s %s'  % (self.user, self.partner, self.mapping_id)


