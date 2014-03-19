from django.http import HttpResponse

from tastypie import fields
from tastypie.api import Api
from tastypie.resources import ModelResource
from tastypie.exceptions import Unauthorized
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.authorization import DjangoAuthorization
from tastypie.authentication import SessionAuthentication

from django.contrib.auth.models import User
from api.models import Text, Action, Community, Doc

class DynamicToOneField(fields.ToOneField):
    ID_AFFIX = '_id'

    def __init__(self, to, attribute, **kwargs):
        super(DynamicToOneField, self).__init__(to, attribute, 
                                                full=True, **kwargs)

    def dehydrate(self, bundle, **kwargs):
        if self.attribute in bundle.request.GET.get('fields', '').split(','):
            return super(DynamicToOneField, self).dehydrate(bundle, **kwargs)
        fk = getattr(bundle.obj, '%s%s' % (self.attribute, self.ID_AFFIX), None)
        if fk:
            fk_resource = self.get_related_resource(None)
            fake_obj = lambda: None
            setattr(fake_obj, 'pk', fk)
            return fk_resource.get_resource_uri(bundle_or_obj=fake_obj)

class DynamicToManyField(fields.ToManyField):
    pass

class DynamicModelResource(ModelResource):
    FIELDS_PARAM_NAME = 'fields'

    def __init__(self, *args, **kwargs):
        super(DynamicModelResource, self).__init__(*args, **kwargs)
        self.dynamic_fields = {}
        for field_name, field_object in self.fields.items():
            if isinstance(field_object, DynamicToManyField):
                self.dynamic_fields[field_name] = self.fields.pop(field_name)

    def get_object_list(self, request):
        objects = super(DynamicModelResource, self).get_object_list(request)
        fs = request.GET.get(self.FIELDS_PARAM_NAME, '').split(',')
        if fs:
            objects = objects.select_related(*fs)
            for field_name, field_object in self.dynamic_fields.items():
                if field_name in fs:
                    if isinstance(field_object, DynamicToOneField):
                        field_object.full = True
                    if field_name not in self.fields:
                        self.fields[field_name] = field_object
                else:
                    if isinstance(field_object, DynamicToOneField):
                        field_object.full = False
                    if field_name in self.fields:
                        self.fields.pop(field_name)
        return objects

class APIResource(DynamicModelResource):
    class Meta:
        authentication = SessionAuthentication()
        authorization = DjangoAuthorization()
        always_return_data = True

    def is_authenticated(self, request):
        auth_result = self._meta.authentication.is_authenticated(request)

        if isinstance(auth_result, HttpResponse):
            raise ImmediateHttpResponse(response=auth_result)

        if not auth_result is True and request.method != 'GET':
            raise ImmediateHttpResponse(response=http.HttpUnauthorized())
        return auth_result


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

class ActionResource(ModelResource):
    user = DynamicToOneField(UserResource, 'user')
    community = DynamicToOneField(CommunityResource, 'community')
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


class DocResource(APIResource):

    class Meta:
        queryset = Doc.objects.all()

    def apply_filters(self, request, filters):
        objects = super(DocResource, self).apply_filters(request, filters)
        parent_pk = request.GET.get('parent', '')
        if parent_pk:
            parent = Doc.objects.get(pk=parent_pk)
            objects = objects.filter(
                tree_id=parent.tree_id, depth=parent.depth+1, 
                lft__gt=parent.lft, rgt__lt=parent.rgt)
        return objects

v1_api = Api(api_name='v1')
for cls in (
    TextResource, ActionResource, UserResource, CommunityResource, DocResource
):
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


