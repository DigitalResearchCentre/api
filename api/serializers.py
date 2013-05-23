from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import *

class CommunitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Community
        fields = (
            'id', 'url', 'name', 'abbr', 'long_name', 'description', 
            'docs', 'entities'
        )

class UserSerializer(serializers.HyperlinkedModelSerializer):
    
    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'first_name', 'last_name', 'email')
        read_only_fields = ('username',)

class DocSerializer(serializers.HyperlinkedModelSerializer):
    parent = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='doc-detail')
    prev = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='doc-detail')
    next = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='doc-detail')
    has_parts = serializers.HyperlinkedRelatedField(
        many=True, read_only=True, view_name='doc-detail')
    has_text_in = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='text-detail')
    has_image = serializers.URLField(source='has_image')
    has_transcript = serializers.HyperlinkedRelatedField(
        many=True, read_only=True, view_name='transcript-detail')

    class Meta:
        model = Doc
        fields = (
            'id', 'url', 'parent', 'prev', 'next', 'has_parts',
            'name', 'label', 'has_text_in', 'has_image', 'has_transcript'
        )

class EntitySerializer(serializers.HyperlinkedModelSerializer):
    parent = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='entity-detail')
    prev = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='entity-detail')
    next = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='entity-detail')
    has_parts = serializers.HyperlinkedRelatedField(
        many=True, read_only=True, view_name='entity-detail')
    has_text_of = serializers.HyperlinkedRelatedField(
        many=True, read_only=True, view_name='text-detail')

    class Meta:
        model = Entity
        fields = (
            'id', 'url', 'parent', 'prev', 'next', 'has_parts',
            'name', 'label', 'has_text_of'
        )

class TextSerializer(serializers.HyperlinkedModelSerializer):
    element = serializers.Field(source='to_element')
    xml = serializers.Field(source='xml')
    parent = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='text-detail')
    prev = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='text-detail')
    next = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='text-detail')
    has_parts = serializers.HyperlinkedRelatedField(
        many=True, read_only=True, view_name='text-detail')
    is_text_in = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='doc-detail')
    is_text_of = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='entity-detail')

    class Meta:
        model = Text
        fields = (
            'id', 'url', 'parent', 'prev', 'next', 'has_parts',
            'element', 'is_text_in', 'is_text_of', 'xml', 
        )

class TranscriptSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Transcript



