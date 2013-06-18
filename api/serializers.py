from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import *

class CommunitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Community
        fields = ('id', 'name', 'abbr', 'long_name', 'description',)

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')
        read_only_fields = ('username',)

class DocSerializer(serializers.ModelSerializer):
#    parent = serializers.HyperlinkedRelatedField(
#        read_only=True, view_name='doc-detail')
#    prev = serializers.HyperlinkedRelatedField(
#        read_only=True, view_name='doc-detail')
#    next = serializers.HyperlinkedRelatedField(
#        read_only=True, view_name='doc-detail')
#    has_parts = serializers.HyperlinkedRelatedField(
#        many=True, read_only=True, view_name='doc-detail')
#    has_text_in = serializers.HyperlinkedRelatedField(
#        read_only=True, view_name='text-detail')
#    has_image = serializers.URLField(source='has_image')
#    has_transcript = serializers.HyperlinkedRelatedField(
#        many=True, read_only=True, view_name='transcript-detail')
            #'parent', 'prev', 'next', 'has_parts',
            #'has_text_in', 'has_image', 'has_transcript'

    class Meta:
        model = Doc
        fields = ('id', 'name', 'label', )

class EntitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Entity
        fields = ('id', 'name', 'label', )

class TextSerializer(serializers.ModelSerializer):
    element = serializers.Field(source='to_element')

    class Meta:
        model = Text
        fields = ('id', 'element',)

class TranscriptSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transcript



