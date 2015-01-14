from django.http import HttpResponse

from tastypie import fields
from tastypie.api import Api
from tastypie.resources import ModelResource
from tastypie.exceptions import Unauthorized
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.authorization import DjangoAuthorization
from tastypie.authentication import SessionAuthentication

from django.contrib.auth.models import User
from api.models import Text, Action, Community, Doc, Attr, UserMapping

class DynamicField(object):
    pass

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

class DynamicCharField(DynamicField, fields.CharField):
    pass

class DynamicToManyField(DynamicField, fields.ToManyField):
    pass

class DynamicModelResource(ModelResource):
    FIELDS_PARAM_NAME = 'fields'

    def __init__(self, *args, **kwargs):
        super(DynamicModelResource, self).__init__(*args, **kwargs)
        self.dynamic_fields = {}
        for field_name, field_object in self.fields.items():
            if isinstance(field_object, DynamicField):
                self.dynamic_fields[field_name] = self.fields.pop(field_name)

    def get_object_list(self, request):
        objects = super(DynamicModelResource, self).get_object_list(request)
        fs = request.GET.get(self.FIELDS_PARAM_NAME, '').split(',')
        if fs:
            objects = objects.select_related(*fs)
            for field_name, field_object in self.dynamic_fields.items():
                if field_name in fs:
                    if field_name not in self.fields:
                        self.fields[field_name] = field_object
                else:
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
            print 'why here?'
            raise ImmediateHttpResponse(response=auth_result)

        if (not auth_result is True) and request.method != 'GET':
            raise ImmediateHttpResponse(response=http.HttpUnauthorized())
        return auth_result


class TextResource(ModelResource): 

    class Meta:
        queryset = Text.objects.all()

class UserMappingResource(ModelResource):
    class Meta:
        queryset = UserMapping.objects.all()

class UserResource(ModelResource):
    usermapping = DynamicToOneField(UserMappingResource, 
                                    'usermapping', null=True)

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
    facs = DynamicCharField()
    rend = DynamicCharField()
    lft = fields.IntegerField(attribute='lft', readonly=True, null=True)
    rgt = fields.IntegerField(attribute='rgt', readonly=True, null=True)
    depth = fields.IntegerField(attribute='depth', readonly=True, null=True)
    tree_id = fields.IntegerField(attribute='tree_id', readonly=True, null=True)

    class Meta(APIResource.Meta):
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

    def dehydrate_facs(self, bundle):
        text = bundle.obj.has_text_in()
        if text:
            return text.get_attr_value('facs')

    def dehydrate_rend(self, bundle):
        text = bundle.obj.has_text_in()
        if text:
            return text.get_attr_value('rend')

    def is_valid(self, bundle):
        valid = super(DocResource, self).is_valid(bundle)
        if not valid:
            errors = bundle.errors[self._meta.resource_name]
        else:
            errors = {}
        data = bundle.data
        parent_pk = data.get('parent')
        if not parent_pk:
            msg = 'is required attribute if parent is not given'
            for field in ['rgt', 'lft', 'depth', 'tree_id']:
                if not field in data:
                    errors[field] = '%s %s' % (field, msg)
        elif not Doc.objects.filter(pk=parent_pk).exists():
            errors['parent'] = 'parent %s not exists' % parent_pk
        if errors:
            bundle.errors[self._meta.resource_name] = errors
            return False
        return True

    def save_related(self, bundle):
        super(DocResource, self).save_related(bundle)
        # TODO: following code should not belong to save_related
        #   Maybe need add a pre_save
        data = bundle.data
        parent_pk = data.get('parent')
        prev_pk = data.get('prev')
        if parent_pk and not data.get('lft'):
            parent = Doc.objects.get(pk=parent_pk)
            parent_text = parent.has_text_in()
            body = parent_text.get_children().get(tag='body')
            obj = bundle.obj
            # TODO: hard code label
            if prev_pk:
                prev = Doc.objects.get(pk=prev_pk)
                obj = prev.add_sibling(pos='right',
                                       name=obj.name, label='Folio')
                text = prev.has_text_in()
                next_text = text.next()
            else:
                next_page = parent.get_first_child()
                if next_page:
                    obj = next_page.add_sibling(pos='left', 
                                                name=obj.name, label='Folio')
                else:
                    obj = parent.add_child(name=obj.name, label='Folio')
                next_text = body.get_first_child()
            if next_text:
                # TODO: entity ?
                obj = Doc.objects.get(pk=obj.pk)
                next_text = Text.objects.get(pk=next_text.pk)
                next_text.add_sibling(pos='left', tag='pb', doc=obj)
            else:
                text = body.add_child(tag='pb', doc=obj)
            bundle.obj = obj

    def authorized_update_detail(self, object_list, bundle):
        return True

    def authorized_create_detail(self, object_list, bundle):
        return True

    def save(self, bundle, **kwargs):
        bundle = super(DocResource, self).save(bundle, **kwargs)
        text = bundle.obj.has_text_in()
        data = bundle.data
        if text:
            facs = data.get('facs')
            rend = data.get('rend')
            if facs:
                try:
                    facs_attr = text.attr_set.get(name='facs')
                except Attr.DoesNotExist:
                    facs_attr = Attr(text=text, name='facs')
                if facs_attr.value != facs:
                    facs_attr.value = facs
                    facs_attr.save()
            if rend:
                try:
                    rend_attr = text.attr_set.get(name='rend')
                except Attr.DoesNotExist:
                    rend_attr = Attr(text=text, name='rend')
                if rend_attr.value != rend:
                    rend_attr.value = rend
                    rend_attr.save()
        return bundle

v1_api = Api(api_name='v1')
for cls in (
    TextResource, ActionResource, UserResource, CommunityResource, DocResource,
    UserMappingResource,
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


