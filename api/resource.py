from tastypie.resources import ModelResource
from tastypie.authorization import DjangoAuthorization
from tastypie.exceptions import Unauthorized
from tastypie.api import Api
from api.models import Text, Action

class TextResource(ModelResource): 
    class Meta:
        queryset = Text.objects.all()


class ActionResource(ModelResource):
    class Meta:
        queryset = Action.objects.all()
        authorization = DjangoAuthorization()

    def action_test(self, request, data):
        print data
        return data

    def alter_deserialized_detail_data(self, request, data):
        action = data.get('action')
        if action:
            f = getattr(self, 'action_%s' % action, None)
            if not f:
                self.unauthorized_result(data)
            return f(request, data)
        return data

v1_api = Api(api_name='v1')
for cls in (TextResource, ActionResource):
    v1_api.register(cls())
urls = v1_api.urls




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


