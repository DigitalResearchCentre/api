import json
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
    # Not a real m2m here, there is a unique community in database level
    docs = models.ManyToManyField('Doc')
    entities = models.ManyToManyField('Entity')

    def get_docs(self):
        return self.docs.all()

    def get_entities(self):
        return self.entities.all()

    def get_urn_base(self):
        return 'urn:det:TCUSask:' + self.abbr

class Node(NS_Node):
    class Meta:
        abstract = True

    def has_parts(self):
        return self.get_children()

    def next(self):
        return self.get_next_sibling()

    def prev(self):
        return self.get_prev_sibling()

    # deep first prev (include ancestor)
    def get_df_prev(self):
        qs = self.__class__.objects.filter(
            lft__lt=self.lft, tree_id=self.tree_id
        ).order_by('-lft')
        r = list(qs[:1])
        return r[0] if r else None

    def parent(self):
        return self.get_parent()

class DETNode(Node):
    name = models.CharField(max_length=63)
    label = models.CharField(max_length=63)

    class Meta:
        abstract = True

    def get_community(self):
        return self.get_root().community_set.get()

class Entity(DETNode):

    def has_text_of(self):
        return self.text_set.all()

class Doc(DETNode):

    def has_text_in(self):
        try:
            return self.text
        except Text.DoesNotExist, e:
            return None

    def has_image(self):
        return None

    def has_transcript(self):
        return self.transcript_set.all()

    def get_texts(self):
        text = self.has_text_in()
        qs = Text.objects.filter(tree_id=text.tree_id, lft__gte=text.lft)
        # find the first text with a doc 
        # which isnot decensder of current doc
        r = list(qs.filter(~Q(
            doc__tree_id=self.tree_id, doc__lft__gte=self.lft, doc__rgt__lte=self.rgt
        )).exclude(doc__isnull=True)[:1])
        if r:
            return qs.filter(lft__lt=r[0].lft)
        return Text.objects.none()

    def has_entities_in(self):
        urn_base = self.get_community().get_urn_base()
        text = self.has_text_in()
        if text is None:
            return []
        qs = self.get_texts()
        doc_urn = get_urn(urn_base, doc=self)
        entity_json = lambda e: {'id': e.id, 'name': e.name, 'label': e.label}
        entity = text.is_text_of()
        last_entity = entity_json(entity) if entity else None
        qs = qs.exclude(entity__isnull=True, doc__isnull=True).select_related('entity', 'doc')
        entities = []
        for text in qs:
            if text.doc_id is not None:
                doc_urn = get_urn(urn_base, doc=text.doc)
            if text.entity_id is not None:
                entity = entity_json(text.entity)
                entity['firstlocation'] = doc_urn
                entities.append(entity)
                if last_entity is not None:
                    last_entity['lastlocation'] = doc_urn
                last_entity = entity
        if last_entity:
            last_entity['lastlocation'] = doc_urn
        return entities

def get_urn(urn_base, doc=None, entity=None):
    parts = [urn_base]
    for det in (doc, entity):
        if det is not None:
            parts += [
                '%s=%s' % (ancestor.label, ancestor.name) 
                for ancestor in det.get_ancestors()
            ] + ['%s=%s' % (det.label, det.name)]
    return ':'.join(parts)

def _to_xml(qs, prev_doc=None):
    xml = ''
    qs = qs.prefetch_related('attr_set')

    nodes = list(qs)
    if nodes: 
        q = deque()
        urn_base = ''

        if prev_doc is not None:
            urn_base = prev_doc.get_community().get_urn_base()

        ancestors = nodes[0].get_ancestors().select_related('entity', 'doc')
        for ancestor in ancestors:
            q.append(ancestor)
            extra_attrs = {}
            if prev_doc is not None and ancestor.entity_id is not None:
                doc = ancestor.is_text_in()
                if doc is None or doc.lft < prev_doc.lft:
                    doc = prev_doc
                extra_attrs['prev'] = get_urn(
                    urn_base, doc=doc, entity=ancestor.entity
                )
            xml += ancestor.to_element(open=True, extra_attrs=extra_attrs)

        prev = nodes[0]
        prev_depth = prev.get_depth()

        for node in nodes[1:]:
            depth = node.get_depth()
            open = (depth > prev_depth)
            if open:
                q.append(prev)
            xml += prev.to_element(open=open)

            for i in range(0, prev_depth - depth):
                parent = q.pop()
                xml += '</%s>' % parent.tag

            prev, prev_depth = (node, depth)

        xml += prev.to_element()

        while q:
            parent = q.pop()
            xml += '</%s>' % parent.tag
    return xml

class Text(Node):
    tag = models.CharField(max_length=15)
    text = models.TextField(blank=True) # should only have one of tag or text
    doc = models.OneToOneField(Doc, null=True, blank=True, editable=False)
    entity = models.ForeignKey(Entity, null=True, blank=True, editable=False)

    def to_element(self, open=False, extra_attrs=None):
        if self.tag:
            attrs = [self.tag] + [
                '%s="%s"' % (attr.name, attr.value) 
                for attr in self.attr_set.all()
            ]
            if extra_attrs:
                for name, value in extra_attrs.items():
                    attrs.append('%s="%s"' % (name, value))
            return ('<%s>' if open else '<%s/>') % ' '.join(attrs)
        else:
            return self.text

    def xml(self):
        if self.doc_id is None:
            qs = Text.get_tree(self)
            prev_doc = None
        else:
            qs = self.doc.get_texts()
            prev_doc = self.doc.get_df_prev()
        return _to_xml(qs, prev_doc=prev_doc)

    def is_text_in(self):
        if self.doc_id is not None:
            return self.doc
        r = list(Text.objects.filter(
            tree_id=self.tree_id, lft__lt=self.lft, doc__isnull=False
        ).select_related('doc').order_by('-lft')[:1])
        if r:
            return r[0].doc

    def is_text_of(self):
        if self.entity_id is not None:
            return self.entity
        r = list(self.get_ancestors().filter(
            entity__isnull=False
        ).order_by('-depth')[:1])
        if r:
            return r[0].entity

class Attr(models.Model):
    text = models.ForeignKey(Text)
    name = models.CharField(max_length=63)
    value = models.CharField(max_length=255, blank=True)

class Transcript(models.Model):
    doc = models.ForeignKey(Doc)






