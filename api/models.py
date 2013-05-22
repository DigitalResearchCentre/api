from collections import deque
from django.db import models
from django.db.models import Q
from treebeard.ns_tree import NS_Node
from django.contrib.auth.models import User

class Community(models.Model):
    name = models.CharField(max_length=20, unique=True)
    abbr = models.CharField(
        max_length=4, verbose_name='abbreviation', unique=True
    )
    long_name = models.CharField(max_length=80, blank=True)
    description = models.TextField(blank=True)
    docs = models.ManyToManyField('Doc')
    entities = models.ManyToManyField('Entity')

class Node(NS_Node):
    class Meta:
        abstract = True

    def has_parts(self):
        return self.get_children()

    def next(self):
        return self.get_next_sibling()

    def prev(self):
        return self.get_prev_sibling()

    def parent(self):
        return self.get_parent()

class Entity(Node):
    name = models.CharField(max_length=63)
    label = models.CharField(max_length=63)

    def has_text_of(self):
        return self.text_set.all()

class Doc(Node):
    name = models.CharField(max_length=63)
    label = models.CharField(max_length=63)

    def has_text_in(self):
        try:
            return self.text
        except Text.DoesNotExist, e:
            return None

    def has_image(self):
        return None

    def has_transcript(self):
        return self.transcript_set.all()

def _to_xml(qs):
    q = deque()
    xml, prev, prev_depth = ('', None, -1)

    for node in qs:
        depth = node.get_depth()

        if prev is not None: 
            open = (depth > prev_depth)
            if open:
                q.append(prev)
            xml += prev.to_element(open=open)

        for i in range(0, prev_depth - depth):
            parent = q.pop()
            xml += '</%s>' % parent.tag

        print node.tag
        print xml
        prev, prev_depth = (node, depth)

    if prev is not None: 
        xml += prev.to_element()

    while q:
        parent = q.pop()
        xml += '</%s>' % parent.tag

    return xml

# from api.models import *
# Doc.add_root(name='Hg', label='document')
# hg = Doc.objects.get(pk=1)
# hg.add_child(name='2r', label='folio')
# pb = Doc.objects.get(pk=2)
# gp = Entity.add_root(name='GP', label='group')
# gp = Entity.objects.get(pk=gp.pk)
# line = gp.add_child(name='1', label='line')
# 
# body = Text.add_root(tag='body', doc=hg)
# body = Text.objects.get(pk=body.pk)
# body.add_child(tag='pb', doc=pb)
# body = Text.objects.get(pk=body.pk)
# div = body.add_child(tag='div', entity=gp)
# div = Text.objects.get(pk=div.pk)
# l = div.add_child(tag='l', entity=line)
# l = Text.objects.get(pk=l.pk)
# l.add_child(text='hello world')
# c = Community.objects.create(name='Cat', abbr='CTP2')
# c.docs.add(hg)
# c.entities.add(gp)

class Text(Node):
    tag = models.CharField(max_length=15)
    text = models.TextField(blank=True) # should only have one of tag or text
    doc = models.OneToOneField(Doc, null=True, blank=True, editable=False)
    entity = models.ForeignKey(Entity, null=True, blank=True, editable=False)

    def to_element(self, open=False):
        if self.tag:
            attrs = ' '.join([self.tag] + [
                '%s="%s"' % (attr.name, attr.value) 
                for attr in self.attr_set.all()
            ])
            if open:
                return '<%s>' % attrs
            else:
                return '<%s/>' % attrs
        else:
            return self.text

    def xml(self):
        xml = _to_xml(Text.get_tree(self))
        doc = self.doc
        if doc is not None:
            qs = Text.objects.filter(tree_id=self.tree_id, lft__gt=self.rgt)
            r = list(qs.filter(~Q(
                doc__tree_id=doc.tree_id, 
                doc__lft__gt=doc.lft, 
                doc__rgt__lt=doc.rgt
            )).exclude(doc__isnull=True)[:1])
            if r:
                qs = qs.filter(rgt__lt=r[0].lft)
            xml += _to_xml(qs)
        return xml

    def is_text_in(self):
        if self.doc:
            return self.doc
        r = list(Text.objects.filter(
            tree_id=self.tree_id, lft__lt=self.lft, doc__isnull=False
        ).order_by('-lft')[:1])
        if r:
            return r[0].doc
        return None

    def is_text_of(self):
        if self.entity:
            return self.entity
        r = list(self.get_ancestors().filter(
            entity__isnull=False
        ).order_by('-depth')[:1])
        if r:
            return r[0].entity
        return None

class Attr(models.Model):
    text = models.ForeignKey(Text)
    name = models.CharField(max_length=63)
    value = models.CharField(max_length=255, blank=True)

class Transcript(models.Model):
    doc = models.ForeignKey(Doc)


