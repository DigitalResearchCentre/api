from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import *

class CommunitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Community
        fields = ('id', 'name', 'abbr', 'long_name', 'font', 'description',)

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')
        read_only_fields = ('username',)

class NodeSerializer(serializers.ModelSerializer):

    def has_parent(self, obj):
        return not obj.is_root()

    def has_parts(self, obj):
        return not obj.is_leaf()

class DocSerializer(NodeSerializer):
    has_parent = serializers.SerializerMethodField('has_parent')
    has_parts = serializers.SerializerMethodField('has_parts')

    class Meta:
        model = Doc

class EntitySerializer(NodeSerializer):
    has_parent = serializers.SerializerMethodField('has_parent')
    has_parts = serializers.SerializerMethodField('has_parts')

    class Meta:
        model = Entity

class TextSerializer(NodeSerializer):
    element = serializers.Field(source='to_el_str')

    class Meta:
        model = Text
        fields = ('id', 'element',)

class RevisionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Revision

class TilerImageSerializer(serializers.ModelSerializer):
    max_zoom = serializers.Field(source='max_zoom')

    class Meta:
        model = TilerImage
        fields = ('id', 'doc', 'width', 'height', 'max_zoom')

class CSSSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSS

class RefsDeclSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefsDecl

class JSSerializer(serializers.ModelSerializer):

    class Meta:
        model = JS
