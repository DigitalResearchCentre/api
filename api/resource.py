from tastypie import fields
from tastypie.api import Api
from tastypie.constants import ALL
from tastypie.resources import ModelResource
from tastypie.exceptions import Unauthorized
from tastypie.authorization import DjangoAuthorization
from django.contrib.auth.models import User
from api.models import Text, Action, Community

class TextResource(ModelResource): 
    class Meta:
        queryset = Text.objects.all()

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        excludes = ['password', ]

class CommunityResource(ModelResource):
    class Meta:
        queryset = Community.objects.all()

class DynamicToOneField(fields.ToOneField):
    ID_AFFIX = '_id'

    def dehydrate(self, bundle, **kwargs):
        fields = bundle.request.GET.get('fields', '').split(',')
        if self.attribute in fields:
            return super(DynamicToOneField, self).dehydrate(bundle, **kwargs)
        fk = getattr(bundle.obj, '%s%s' % (self.attribute, self.ID_AFFIX), None)
        fk_resource = self.get_related_resource(None)
        fake_obj = lambda: None
        setattr(fake_obj, 'pk', fk)
        return fk_resource.get_resource_uri(bundle_or_obj=fake_obj)

class ActionResource(ModelResource):
    user = DynamicToOneField(UserResource, 'user', full=True)
    community = DynamicToOneField(CommunityResource, 'community', full=True)
    status = fields.CharField('get_status')

    class Meta:
        queryset = Action.objects.all()
        authorization = DjangoAuthorization()
        filtering = {'community': ALL}

    def get_object_list(self, request):
        objects = super(ActionResource, self).get_object_list(request)
        fields = request.GET.get('fields', '').split(',')
        if fields:
            objects = objects.select_related(*fields)
        return objects


v1_api = Api(api_name='v1')
for cls in (TextResource, ActionResource, UserResource, CommunityResource):
    v1_api.register(cls())
urls = v1_api.urls

    # def create_action(self, actor, verb, **kwargs):
        # action = Action(
            # actor_content_type=ContentType.objects.get_for_model(actor),
            # actor_object_id=actor.pk, verb=unicode(verb),)
        # for opt in ('target', 'action_objects'):
            # obj = kwargs.pop(opt, None)
            # if obj is not None:
                # setattr(action, '%s_object_id' % opt, obj.pk)
                # setattr(action, '%s_object_type' % opt,
                        # ContentType.objects.get_for_model(obj))
        # if len(kwargs):
            # action.data = kwargs
        # action.save()
        # return action


# class Action(models.Model):
    # actor_content_type = models.ForeignKey(
        # contenttypes.models.ContentType, related_name='actor')
    # actor_object_id = models.CharField(max_length=255)
    # actor = contenttypes.generic.GenericForeignKey(
        # 'actor_content_type', 'actor_object_id')

    # verb = models.CharField(max_length=255)

    # target_content_type = models.ForeignKey(
        # contenttypes.models.ContentType, 
        # related_name='target', blank=True, null=True)
    # target_object_id = models.CharField(max_length=255, blank=True, null=True)
    # target = contenttypes.generic.GenericForeignKey(
        # 'target_content_type', 'target_object_id')

    # action_object_content_type = models.ForeignKey(
        # contenttypes.models.ContentType,
        # related_name='action_object', blank=True, null=True)
    # action_object_object_id = models.CharField(max_length=255, blank=True,
        # null=True)
    # action_object = contenttypes.generic.GenericForeignKey(
        # 'action_object_content_type', 'action_object_object_id')

    # data = JSONField(blank=True, null=True)

    # timestamp = models.DateTimeField(auto_now_add=True)

    # class Meta:
        # ordering = ('-timestamp', )




# class ActionView(generics.View):
    # permission_classes = (permissions.IsAuthenticated,)
    # ALLOWED_TASK = ('delete_doc')

    # def action_test(self, request):
        # result = tasks.test.apply_async()
        # action.send(request.user, verb='test', 
                    # action_object=request.user, target=request.user,
                    # result=result.id)
        # return result

    # def post(self, request, *args, **kwargs):
        # verb = request.DATA.get('action')
        # return getattr('action_%s' % verb)(request, *args, **kwargs)
        # if verb in self.ALLOWED_TASK:
            # task = getattr(tasks, verb)
            # result = task.apply_async(request.DATA.get('args', ()),
                                      # request.DATA.get('kwargs', {}))
        # user = request.user
        # {community: 1, action: 'delete doc', target: Doc, data}
        # action.send(
            # request.user, 
            # verb='delete',
            # action_object=Doc,
            # target=Community,
            # result=result_id)



        # return {
            # 'status': 'success'
            # 'status': 'failure',
            # 'msg': ''
        # }

        # task


