from rest_framework import serializers
from api.models import (
    Community, Membership, Entity, Doc, Text, Revision, RefsDecl,
    APIUser, Group, TilerImage, CSS, Task, JS, Schema, Invitation)


class CommunitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Community
        fields = ('id', 'name', 'abbr', 'long_name', 'font', 'description',)


class APIUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = APIUser
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


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task


class MembershipSerializer(serializers.ModelSerializer):
    community = CommunitySerializer()
    role = GroupSerializer()
    tasks = serializers.SerializerMethodField('get_tasks')

    class Meta:
        model = Membership

    def get_tasks(self, obj):
        if obj.user:
            qs = obj.user.task_set.filter(community=obj.community)
            return TaskSerializer(qs).data


class MemberSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField('get_name')

    class Meta:
        model = Membership

    def get_name(self, obj):
        user = obj.user
        if user:
            name = '%s %s' % (user.first_name, user.last_name)
            return name.strip() or user.username
        else:
            return ''


class JSSerializer(serializers.ModelSerializer):

    class Meta:
        model = JS


class SchemaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Schema


class InvitationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Invitation
