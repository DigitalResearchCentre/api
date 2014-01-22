from tastypie.resources import ModelResource
from tastypie.api import Api
from api.models import Text

class TextResource(ModelResource): 
    class Meta:
        queryset = Text.objects.all()


v1_api = Api(api_name='v1')
for cls in (TextResource,):
    v1_api.register(cls())
urls = v1_api.urls


