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

def get_first(qs):
    lst = list(qs[:1])
    return lst[0] if lst else None

def get_last(qs):
    lst = list(qs.reverse()[:1])
    return lst[0] if lst else None

class Node(NS_Node):
    class Meta:
        abstract = True

    def has_parts(self):
        return self.get_children().order_by('lft')

    def next(self):
        return self.get_next_sibling()

    def prev(self):
        return self.get_prev_sibling()

    def parent(self):
        return self.get_parent()

    # deep first prev (include ancestor)
    def get_df_prev(self):
        return get_first(self.__class__.objects
                .filter(lft__lt=self.lft, tree_id=self.tree_id)
                .order_by('-lft'))

    # deep first prev (include ancestor)
    def get_df_next(self):
        return get_first(self.__class__.objects
                .filter(lft__gt=self.lft, tree_id=self.tree_id)
                .order_by('lft'))

    def get_all_after(self):
        return (self.__class__.objects
                .filter(tree_id=self.tree_id, lft__gt=self.lft)
                .order_by('lft'))

    def is_root(self):
        return self.lft == 1

class DETNode(Node):
    name = models.CharField(max_length=63)
    label = models.CharField(max_length=63)

    class Meta:
        abstract = True

    def get_community(self):
        return self.get_root().community_set.get()

def get_urn(urn_base, doc=None, entity=None):
    parts = [urn_base]
    for det in (doc, entity):
        if det is not None:
            parts += [
                '%s=%s' % (ancestor.label, ancestor.name) 
                for ancestor in det.get_ancestors()
            ] + ['%s=%s' % (det.label, det.name)]
    return ':'.join(parts)

class Entity(DETNode):

    def has_text_of(self, doc_pk=None):
        qs = self.text_set.all()
        if doc_pk is not None:
            doc = Doc.objects.get(pk=doc_pk)
            start = doc.has_text_in()
            if start is not None:
                qs = qs.filter(tree_id=text.tree_id, lft__gt=start.lft)
                bound = doc._get_texts_bound()
                if bound is not None:
                    qs = qs.filter(lft__lt=bound.lft)
        return qs

    def get_urn(self):
        return get_urn(self.get_community().get_urn_base(), entity=self)

    def has_docs(self, doc_pk=None):
        texts = self.has_text_of()
        doc = None
        if doc_pk is not None:
            doc = Doc.objects.get(pk=doc_pk)
            doc_text = doc.has_text_in()
            if doc_text is not None:
                texts = texts.filter(tree_id=doc_text.tree_id)

        result = Doc.objects.none()
        for text in texts:
            descendants = text.get_descendants()
            first = get_first(descendants)
            if first is None:
                first = text
                last = text
            else:
                last = get_last(descendants)
            first_doc = first.is_text_in()
            last_doc = last.is_text_in()
            qs = Doc.objects.filter(
                tree_id=first_doc.tree_id, 
                rgt__gt=first_doc.lft, lft__lt=last_doc.lft
            )
            if doc is None:
                qs = qs.filter(depth=qs.aggregate(d=models.Min('depth'))['d'])
            else:
                qs = qs.filter(tree_id=doc.tree_id,
                               lft__range=(doc.lft+1, doc.rgt - 1),
                               depth=doc.get_depth()+1)
            result = result | qs
        return result

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
        qs = Text.objects.filter(tree_id=text.tree_id, lft__gt=text.lft)
        bound = self._get_texts_bound()
        if bound is not None:
            qs = qs.filter(lft__lt=bound.lft)
        return qs.order_by('lft')

    def _get_texts_bound(self):
        text = self.has_text_in()
        # find the first text with a doc 
        # which isnot decensder of current doc
        return text and get_first(text.get_all_after()
                                  .exclude(doc__tree_id=self.tree_id, 
                                           doc__lft__gte=self.lft,
                                           doc__rgt__lte=self.rgt)
                                  .exclude(doc__isnull=True))

    def has_entities(self, entity_pk=None):
        text = self.has_text_in()
        if text is None:
            return self.__class__.objects.none()

        qs = Entity.objects.filter(text__tree_id=text.tree_id,
                                   text__rgt__gt=text.lft)
        bound = self._get_texts_bound()
        if bound is not None:
            qs = qs.filter(text__lft__lt=bound.lft)

        # TODO: <div><pb/><l>line1</l>text mix with entity<l>line2</l></div>
        # in above case "text mix with entity" will lost
        if entity_pk is None:
            # exclude outer entity
            if bound is not None:
                qs = qs.exclude(text__lft__lt=text.lft,
                                text__rgt__gt=bound.lft)
            qs = qs.filter(depth=qs.aggregate(d=models.Min('depth'))['d'])
        else:
            entity = Entity.objects.get(pk=entity_pk)
            qs = qs.filter(tree_id=entity.tree_id,
                           lft__range=(entity.lft+1, entity.rgt - 1))
        return qs.order_by('lft')

    def get_urn(self):
        return get_urn(self.get_community().get_urn_base(), doc=self)

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

    def get_urn(self):
        doc = self.is_text_in()
        return get_urn(
            doc.get_community().get_urn_base(), 
            doc=doc, entity=self.is_text_of()
        )

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
        # <text/> element can have both entity and doc
        if self.entity_id is not None or self.doc_id is None:
            qs = self.get_tree(self)
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






