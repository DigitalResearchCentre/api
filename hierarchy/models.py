from django.db import models, transaction
from django.utils.translation import ugettext_noop as _
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType

from hierarchy.utils import NumConv

def create_closure_table_path_model(field, klass):
    from django.db import models
    name = '%s_%s' % (klass._meta.object_name, field.name)
    meta = type(str('Meta'), (object,), {
        'db_table': '%s_%s' % (klass._meta.db_table, field.name),
        'managed': True,
        'auto_created': klass,
        'app_label': klass._meta.app_label,
        'unique_together': ('parent', 'child'),
    })
    return type(str(name), (models.Model,), {
        'Meta': meta,
        '__module__': klass.__module__,
        'parent': models.ForeignKey(klass, related_name='descendants'),
        'child': models.ForeignKey(klass, related_name='ancestors'),
        'depth': models.PositiveSmallIntegerField(),
    })


class ClosureTableField(models.Field):

    def __init__(self, **kwargs):
        super(ClosureTableField, self).__init__('self', **kwargs)

    def contribute_to_class(self, cls, name):
        super(ClosureTableField, self).contribute_to_class(cls, name)
        create_closure_table_path_model(self, cls)


class Node(models.Model):
    ct = ClosureTableField()

    @classmethod
    def get_ancestors(cls, pk):
        return cls.objects.filter(ancestors__child__pk=pk)

    @classmethod
    def get_descendants(cls, pk):
        return cls.objects.filter(descendants__parent__pk=pk)

    @classmethod
    def get_children(cls, pk):
        return cls.objects.filter(
            descendants__parent__pk=pk, descendants__depth=1)

    @classmethod
    def get_parent(cls, pk):
        return cls.objects.filter(ancestors__child__pk=pk, ancestors__depth=1)

    @classmethod
    def get_siblings(cls, pk):
        return cls.objects.filter(
            ancestors__child__pk=pk, ancestors__depth=1)

    @transaction.atomic
    def add_child(self, **kwargs):
        child = self.__class__.objects.create(**kwargs)
        # Path.objects.bulk_create([
            # Path(parent_id=an.parent_id, child=child, depth=an.depth+1)
            # for an in self.ancestors.all()
        # ] + [Path(parent=self, child=child, depth=1)])
        return child

    def get_next_sibling(self):
        raise NotImplementedError

    def get_prev_sibling(self):
        raise NotImplementedError

