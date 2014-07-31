from django.db import models, transaction
from django.utils.translation import ugettext_noop as _
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType

from hierarchy.utils import NumConv

class Node(models.Model):
    depth = models.PositiveSmallIntegerField()
    paths = models.ManyToManyField('self', symmetrical=False)

    class Meta:
        abstract = True

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
        Path.objects.bulk_create([
            Path(parent_id=an.parent_id, child=child, depth=an.depth+1)
            for an in self.ancestors.all()
        ] + [Path(parent=self, child=child, depth=1)])
        return child

    def get_next_sibling(self):
        raise NotImplementedError

    def get_prev_sibling(self):
        raise NotImplementedError

class Foo(Node):
    pass




