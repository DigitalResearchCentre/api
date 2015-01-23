import warnings
warnings.filterwarnings("default", category=PendingDeprecationWarning)

import math
import os
import StringIO
import datetime
import re
import base64
import json
import urllib
import urllib2
import feedparser
from collections import deque
from django.db import models
from django.db.models import Q
from django.conf import settings
from django.http import HttpResponse
from django.utils.timezone import utc
from django.template import Template, Context, loader
from django.core import files
from django.core.urlresolvers import reverse
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.models import User, Group
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType
from celery.result import AsyncResult
from celery.utils.log import get_task_logger

from PIL import Image
from urlparse import urlsplit
from treebeard.ns_tree import NS_Node
from tiler.tiler import Tiler
from lxml import etree
from jsonfield import JSONField

logger = get_task_logger(__name__)

def get_first(qs):
    lst = list(qs[:1])
    return lst[0] if lst else None


class Community(models.Model):
    name = models.CharField(max_length=20, unique=True)
    abbr = models.CharField(
        max_length=4, verbose_name='abbreviation', unique=True
    )
    long_name = models.CharField(max_length=80, blank=True)
    description = models.TextField(blank=True)
    # Not a real m2m here, there is a unique community in database level
    docs = models.ManyToManyField('Doc', blank=True,
                                  limit_choices_to={'depth': 0}, )
    entities = models.ManyToManyField('Entity', blank=True,
                                      limit_choices_to={'depth': 0})
    font = models.CharField(max_length=255, blank=True)
    refsdecls = models.ManyToManyField('RefsDecl', blank=True)
    members = models.ManyToManyField(User, through='Membership')

    def __unicode__(self):
        return self.name

    def delete(self, *args, **kwargs):
        self.get_docs().delete()
        self.get_entities().delete()
        self.get_refsdecls().delete()
        return super(Community, self).delete(*args, **kwargs)

    def get_docs(self):
        return self.docs.all()

    def get_entities(self):
        return self.entities.all()

    def get_urn_base(self):
        return 'urn:det:TCUSask:' + self.abbr

    def get_refsdecls(self):
        return self.refsdecls.all()

    def memberships(self):
        return self.membership_set.all()

    def css(self):
        return self.css_set.all()

    def friendly_url(self):
        return self.communitymapping.get_friendly_url()

    def js(self):
        return self.js_set.all()

    def schema(self):
        return self.schema_set.all()

    def info(self):
        num_pages = num_entity_parts = num_transcribed = num_committed = 0
        for doc in self.docs.all():
            pages = doc.get_descendants().filter(depth=2)
            num_pages += pages.count()
            num_transcribed += pages.filter(revision__isnull=False).count()
            num_committed = pages.filter(cur_rev__isnull=False).count()
        for entity in self.entities.all():
            num_entity_parts += entity.get_descendants().count()
        return {
            'num_docs': self.docs.count(),
            'num_pages': num_pages,
            'num_entities': self.entities.count(),
            'num_entity_parts': num_entity_parts,
            'num_page_transcribed': num_transcribed,
            'num_page_committed': num_committed,
        }

    def get_or_create_doc(self, name):
        try:
            return self.docs.get(name=name)
        except Doc.DoesNotExist:
            doc = Doc.objects.create(name=name, label='document')
            self.docs.add(doc)
            return doc

    def validate(self, xml):
        resp = {}
        if not xml:
            resp['error'] = 'given xml is empty'
        else:
            schema = get_first(self.schema())
            if not schema:
                schema = get_first(Community.get_root_community().schema())
            dtd = etree.DTD(schema.schema.file)
            try:
                doc = etree.XML(xml)
                if not dtd.validate(doc):
                    resp['error'] = unicode(dtd.error_log)
                else:
                    resp['status'] = 'success'
            except etree.XMLSyntaxError, e:
                resp['error'] = unicode(e)
            schema.schema.file.close()
        return resp

    def add_membership(self, **kwargs):
        membership = Membership.objects.create(**kwargs)
        membership.sync()
        return membership

    def get_or_create_membership(self, **kwargs):
        membership, created = Membership.objects.get_or_create(**kwargs)
        if created:
            membership.sync()
        return (membership, created,)

    def get_membership(self, **kwargs):
        return self.membership_set.get(**kwargs)

    @classmethod
    def get_root_community(cls):
        return cls.objects.get(abbr='TC')


# class Availability(models.Model):
    # content_type = models.ForeignKey(ContentType)
    # object_id = models.PositiveIntegerField()
    # content_object = GenericForeignKey('content_type', 'object_id')

    # group = models.ForeignKey(Group)


# def check_perm(perm):
    # perms = obj.get_perms()
    # user



class Membership(models.Model):
    user = models.ForeignKey(User)
    community = models.ForeignKey(Community)
    role = models.ForeignKey(Group)
    create_date = models.DateField(auto_now=True, editable=False)

    def __unicode__(self):
        return u'%s %s %s' % (self.community, self.role, self.user,)

    @property
    def name(self):
        name = '%s %s' % (self.user.first_name, self.user.last_name)
        return name.strip() or self.user.username 

    def tasks(self):
        return self.task_set.all()

    def sync(self):
        try:
            role = {
                'Co Leader': 10166, 'Leader': 10167, 'Transcriber': 10168,
                'Member': 10168,
            }
            usermapping = self.user.usermapping
            communitymapping = self.community.communitymapping
            url = settings.PARTNER_URL + 'add-organization-user-by-group-id'
            data = {
                'groupId': communitymapping.mapping_id,
                'userId': usermapping.mapping_id,
                'roleId': role[self.role.name]
            }
            resp = urllib2.urlopen(urllib2.Request(url, urllib.urlencode(data)))
        except UserMapping.DoesNotExist:
            pass
        except CommunityMapping.DoesNotExist:
            pass


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

    def get_child_after(self, after):
        qs = self.get_children()
        if after is not None:
            qs.filter(lft__gt=after.rgt)
        return get_first(qs)

    def get_child_before(self, before):
        qs = self.get_children()
        if before is not None:
            qs = qs.filter(lft__lte=before.lft)
        return get_last(qs)

    @classmethod
    def load_bulk(cls, bulk_data):

        def _prepare_bulk_data(bulk_data, tree_id, depth, lft):
            for node in bulk_data:
                data = node['data']
                data.update({'tree_id': tree_id, 'depth': depth, 'lft': lft})
                children = node.get('children', [])
                if children:
                    _prepare_bulk_data(children, tree_id, depth + 1, lft + 1)
                    data['rgt'] = children[-1]['data']['rgt'] + 1
                else:
                    data['rgt'] = lft + 1
                lft = data['rgt'] + 1

        stack, objs, roots = [], [], []
        for node in bulk_data:
            root = cls.add_root(**node['data'])
            root = cls.objects.get(pk=root.pk)
            children = node.get('children', [])
            if children:
                _prepare_bulk_data(children, root.tree_id, 2, 2)
                root.rgt = children[-1]['data']['rgt'] + 1
                root.save()
                stack.extend(children)
            roots.append(root)
        while stack:
            node = stack.pop(0)
            objs.append(cls(**node['data']))
            children = node.get('children', [])
            stack.extend(children)
        if objs:
            cls.objects.bulk_create(objs)
        return roots


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
                qs = qs.filter(tree_id=start.tree_id, lft__gt=start.lft)
                bound = doc._get_texts_bound()
                if bound is not None:
                    qs = qs.filter(lft__lt=bound.lft)
        return qs

    def xml(self, doc_pk=None):
        result = []
        if doc_pk is not None:
            doc = Doc.objects.get(pk=doc_pk)
            pb = doc.has_text_in()
            doc_texts = doc.get_texts()
            for text in self.text_set.filter(tree_id=pb.tree_id):
                qs = doc_texts.filter(lft__gte=text.lft, lft__lte=text.rgt)
                result.append(_to_xml(qs, exclude=pb))
        else:
            for text in self.text_set.all():
                result.append(text.xml())
        return result

    def ruleset(self, user_pk):
        try:
            collate = self.collate_set.get(user__pk=user_pk)
            return {
                'alignment': collate.alignment,
                'ruleset': collate.ruleset,
            }
        except:
            return {}

    def witnesses(self):
        try:
            return self.witnessescache.json
        except:
            pass

        def get_content(nodes, index):
            length = len(nodes)
            if index == length:
                return ''
            cur = nodes[index]
            depth = cur.get_depth()
            content = cur.text 
            i = index + 1
            while i < length:
                node = nodes[i]
                if node.get_depth() > depth:
                    c, offset = get_content(nodes, i)
                    content += c + node.tail
                    i += offset
                else:
                    break
            return content, i - index

        witnesses = []
        docs = []
        for text in self.has_text_of():
            doc = text.is_text_in()
            if doc:
                docs.append(doc)
                if text.is_leaf():
                    nodes = [text]
                else:
                    nodes = list(text.get_tree(parent=text))
                content, _ = get_content(nodes, 0)
                witness = {
                    'id': '%s' % text.id,
                    'doc': doc.id,
                    'name': doc.tree_id,
                    'content': content.encode('UTF-8'),
                }
                pb = get_first(
                    doc.get_ancestors().filter(tilerimage__isnull=False))
                if pb:
                    witness['image'] = pb.id
                witnesses.append(witness)

        roots = Doc.objects.filter(depth=1, 
                                   tree_id__in=[d.tree_id for d in docs])
        doc_names = {}
        for r in roots:
            doc_names[r.tree_id] = r.name

        results = []
        for witness in witnesses:
            tree_id = witness['name']
            name = doc_names.get(tree_id)
            if name:
                witness['name'] = name
                results.append(witness)

        from regularize.models import WitnessesCache
        WitnessesCache.objects.create(entity=self, json=results)
        return results

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
            if first_doc:
                last_doc = last.is_text_in()
                qs = Doc.objects.filter(
                    tree_id=first_doc.tree_id,
                    rgt__gt=first_doc.lft, lft__lt=last_doc.lft
                )
            else:
                qs = Doc.objects.none()
            if doc is None:
                qs = qs.filter(depth=qs.aggregate(d=models.Min('depth'))['d'])
            else:
                qs = qs.filter(tree_id=doc.tree_id,
                               lft__range=(doc.lft + 1, doc.rgt - 1),
                               depth=doc.get_depth() + 1)
            result = result | qs
        return result

    @classmethod
    def get_or_create_by_urn(cls, urn):
        community_urn = re.findall(r'(^(?:(?:^|:)\w+)+):', urn)[0]
        community = Community.objects.get(abbr=community_urn.split(':')[-1])

        value_pairs = re.findall(r'(?:(\w+)=([^:=]+)(?::|$))', urn)
        label, name = value_pairs[0]
        try:
            entity = community.entities.get(name=name, label=label)
        except Entity.DoesNotExist:
            entity = Entity.add_root(name=name, label=label)
            community.entities.add(entity)
        for label, name in value_pairs[1:]:
            try:
                entity = entity.get_children().get(label=label, name=name)
            except Entity.DoesNotExist:
                logger.info(entity.label + ', ' + entity.name)
                logger.info(label + ', ' + name)
                entity = entity.add_child(label=label, name=name)
        return entity


class Doc(DETNode):
    cur_rev = models.OneToOneField(
        'Revision', related_name='+', null=True, blank=True
    )

    def has_text_in(self):
        try:
            return self.text
        except Text.DoesNotExist:
            return None

    def xml(self, entity_pk=None):
        if entity_pk is not None:
            entity = Entity.objects.get(pk=entity_pk)
            return entity.xml(doc_pk=self.pk)
        else:
            text = self.has_text_in()
            if text is not None:
                return [text.xml()]
        return []

    def has_image(self, zoom=None, x=None, y=None):
        try:
            tiler_image = self.tilerimage
            try:
                return HttpResponse(
                    tiler_image.read_tile(*map(int, (zoom, x, y,))),
                    content_type='image/jpeg'
                )
            except TypeError:
                return tiler_image
        except TilerImage.DoesNotExist:
            return None

    def cur_revision(self):
        return self.cur_rev

    def has_revisions(self):
        return self.revision_set.all()

    def get_texts(self):
        text = self.has_text_in()
        qs = Text.objects.filter(tree_id=text.tree_id, lft__gte=text.lft)
        bound = self._get_texts_bound()
        if bound is not None:
            qs = qs.filter(lft__lt=bound.lft)
        return qs.order_by('lft')

    def _get_texts_bound(self):
        text = self.has_text_in()
        # find the first text with a doc
        # which isnot decensder of current doc
        # TODO: exclude is slow
        return text and get_first(
            text.get_all_after().filter(doc__isnull=False)
            .exclude(doc__tree_id=self.tree_id, 
                     doc__lft__gte=self.lft, doc__rgt__lte=self.rgt))

    def has_entities(self, entity_pk=None):
        text = self.has_text_in()
        if text is None:
            return self.__class__.objects.none()

        q = Q(text__tree_id=text.tree_id, text__rgt__gt=text.lft)
        bound = self._get_texts_bound()
        if bound is not None:
            q &= Q(text__lft__lt=bound.lft)

        # TODO: <div><pb/><l>line1</l>text mix with entity<l>line2</l></div>
        # in above case "text mix with entity" will lost
        # distinct is importent:
        # inner join with text will cause duplicate entity
        qs = Entity.objects.filter(q)
        if entity_pk is not None:
            entity = Entity.objects.get(pk=entity_pk)
            qs = qs.filter(tree_id=entity.tree_id,
                           lft__range=(entity.lft + 1, entity.rgt - 1))
        qs = qs.filter(depth=qs.aggregate(d=models.Min('depth'))['d'])
        return qs.annotate(models.Min('text__lft')).order_by('text__lft__min')

    def move(self, urn=''):
        pass

    def get_urn(self):
        return get_urn(self.get_community().get_urn_base(), doc=self)

    def bind_files(self, folder):
        for pb in self.get_descendants().filter(
            text__tag='pb', text__attr__name__in=('file', 'facs')
        ).prefetch_related('text__attr_set'):
            file_name = ''
            rend = None
            for attr in pb.text.attr_set.all():
                if attr.name in ('file', 'facs',):
                    file_name = attr.value.lower()
                if attr.name == 'rend':
                    rend = attr.value
            if file_name:
                path = os.path.join(folder, file_name)
                if not os.path.isfile(path):
                    path = '%s.jpg' % path
                    if not os.path.isfile(path):
                        continue
                with open(path, 'r') as f:
                    if rend:
                        rend = rend.split(',')
                    with self.ImageFile(f, rend=rend) as img:
                        try:
                            pb.tilerimage.delete()
                        except TilerImage.DoesNotExist:
                            pass
                        tiler_image = TilerImage(doc=pb)
                        try:
                            tiler_image.image.save(file_name, img)
                        except ValueError:
                            img = Image.open(open(path, 'r'))
                            tiler_image.image._dimensions_cache = img.size
                            tiler_image.width = tiler_image.image.width
                            tiler_image.height = tiler_image.image.height
                            tiler_image.save()

    class ImageFile(files.File):
        def __init__(self, file, rend=None, **kwargs):
            if rend and len(rend) == 4:
                img = Image.open(file)
                rend_img = img.crop((
                    img.size[0] * int(rend[0]) / 100,
                    img.size[1] * int(rend[1]) / 100,
                    img.size[0] * int(rend[2]) / 100,
                    img.size[1] * int(rend[3]) / 100,
                ))

                rend_path = os.path.join(
                    os.path.dirname(file.name),
                    '%s_%s.jpg' % (
                        os.path.basename(urlsplit(file.name)[2]).split('.')[0],
                        ','.join(rend)
                    )
                )
                with open(rend_path, 'wb') as rend_file:
                    rend_img.save(rend_file, 'JPEG')
                    self._orig_file = file
                    file = open(rend_file.name, 'r')
            super(Doc.ImageFile, self).__init__(file, **kwargs)

        def close(self):
            if hasattr(self, '_orig_file'):
                self._orig_file.close()
            super(Doc.ImageFile, self).close()


def _to_xml(qs, exclude=None, bound=None):
    root_el = prev_el = parent_el = etree.Element('TEI')
    qs = qs.prefetch_related('attr_set')
    prev_depth = 0

    nodes = list(qs)
    if nodes:
        q = deque()
        node = nodes[0]

        if node.doc is None:
            prev_doc = node.is_text_in()
        else:
            prev_doc = node.doc.get_df_prev()

        base_det = prev_doc or node.doc or node.is_text_of()
        if base_det is None:
            urn_base = ''
        else:
            urn_base = base_det.get_community().get_urn_base()

        ancestors = node.get_ancestors().select_related('entity', 'doc')
        for ancestor in ancestors:
            extra_attrs = {}
            if ancestor.entity is not None:
                doc = ancestor.is_text_in()
                if doc is None or (
                    prev_doc is not None and doc.lft < prev_doc.lft
                ):
                    doc = prev_doc
                extra_attrs['prev'] = get_urn(urn_base, doc=doc,
                                              entity=ancestor.entity)
            prev_el = parent_el = ancestor.to_el(parent=parent_el,
                                                 extra_attrs=extra_attrs)
            parent_el.text = None
            prev_depth = ancestor.get_depth()
            if bound and bound.rgt < ancestor.rgt:
                parent_el.tail = None
            q.append(parent_el)

        if exclude == node:
            # if first node is exclude, only display it's tail in xml
            parent_el.text = node.tail
            prev_depth = node.get_depth()
            nodes.pop(0)
        # prev_el is already append to q, remove it to prevent duplicate
        if q:
            q.pop()

        for node in nodes:
            depth = node.get_depth()
            open = (depth > prev_depth)
            if open:
                q.append(parent_el)
                parent_el = prev_el

            for i in range(0, prev_depth - depth):
                parent_el = q.pop()

            prev_depth = depth
            prev_el = node.to_el(parent=parent_el)
            if bound and bound.rgt < node.rgt:
                prev_el.tail = None
    return etree.tostring(root_el)[len('<TEI>'):- len('</TEI>')]


class Text(Node):
    tag = models.CharField(max_length=15)
    text = models.TextField(blank=True)
    tail = models.TextField(blank=True)
    doc = models.OneToOneField(Doc, null=True, blank=True, editable=False)
    entity = models.ForeignKey(Entity, null=True, blank=True, editable=False)

    def get_urn(self):
        doc = self.is_text_in()
        return get_urn(
            doc.get_community().get_urn_base(),
            doc=doc, entity=self.is_text_of()
        )

    def is_tag(self):
        return self.tag in (etree.Comment, '!==',)

    def to_el(self, parent=None, extra_attrs={}):
        attrs = {}
        attrs.update(extra_attrs)
        for attr in self.attr_set.all():
            attrs[attr.name] = attr.value
        if parent is None:
            if self.tag == '!--':
                el = etree.Comment()
            else:
                el = etree.Element(self.tag, attrs)
        else:
            if self.tag == '!--':
                el = etree.Comment()
                parent.append(el)
            else:
                el = etree.SubElement(parent, self.tag, attrs)
        # use text or None is because:
        #   lxml will treat None as <tag/>, but '' as <tag></tag>
        el.text = self.text or None
        el.tail = self.tail or None
        return el

    def get_attr_value(self, name):
        try:
            return self.attr_set.get(name=name).value
        except Attr.DoesNotExist:
            return None

    def to_el_str(self, parent=None, extra_attrs={}):
        el = self.to_el(parent=parent, extra_attrs=extra_attrs)
        return etree.tostring(el)

    def xml(self):
        # <text/> element can have both entity and doc
        if self.entity_id is not None or self.doc_id is None:
            qs = self.get_tree(parent=self)
            exclude = None
            bound = None
        else:
            qs = self.doc.get_texts()
            bound = self.doc._get_texts_bound()
            exclude = self.doc.has_text_in()
        return _to_xml(qs, exclude=exclude, bound=bound)

    def is_text_in(self):
        if self.doc_id is not None:
            return self.doc
        last = get_last(
            Text.objects
            .filter(tree_id=self.tree_id, lft__lt=self.lft, doc__isnull=False)
            .select_related('doc')
        )
        return last.doc if last else None

    def is_text_of(self):
        if self.entity_id is not None:
            return self.entity
        first = get_first(self.get_ancestors().filter(
            entity__isnull=False
        ).order_by('-depth'))
        return first.entity if first else None

    def get_refsdecls(self):
        return self.get_root().refsdecl_set.all()

    def load_bulk_el(self, bulk_el, after=None, docs=[]):
        bulk_data = self.__class__._el_to_bulk_data(bulk_el, docs=docs)

        roots = Text.load_bulk(bulk_data)
        attrs = []
        for el, root in zip(bulk_el, roots):
            texts = list(Text.get_tree(parent=root))
            i = 0
            for descendant_el in el.iter():
                attrib = descendant_el.attrib
                for key in attrib:
                    attrs.append(
                        Attr(text=texts[i], name=key, value=attrib[key]))
                i += 1
        if attrs:
            Attr.objects.bulk_create(attrs)

        sibling = self.get_child_before(after)

        if sibling is None and roots:
            sibling = roots.pop(0)
            sibling.move(self, pos='first-child')
        sibling = Text.objects.get(pk=sibling.pk)

        for root in roots:
            root.move(sibling, pos='right')
            sibling = Text.objects.get(pk=root.pk)

    @classmethod
    def _el_to_bulk_data(cls, bulk_el, docs=[]):
        bulk_data = []
        for el in bulk_el:
            data = {'text': el.text or '', 'tail': el.tail or '', }
            if el.tag == etree.Comment:
                tag = '!--'
            else:
                tag = el.xpath('local-name()')
                try:
                    entity_urn = el.attrib.pop('{%s}entity' % el.nsmap.get('det'))
                    data['entity'] = Entity.get_or_create_by_urn(entity_urn)
                except KeyError:
                    pass
            data['tag'] = tag
            if tag in ('pb', 'cb', 'lb') and docs:
                data['doc'] = docs.pop(0)
            children = cls._el_to_bulk_data(el.getchildren(), docs=docs)
            bulk_data.append({'data': data, 'children': children})
        return bulk_data

    def load_tei(self, tei_el, community):
        nsmap = {
            'tei': 'http://www.tei-c.org/ns/1.0',
            # TODO: need update to something like:
            # 'det': 'http://textualcommunities.usask.ca/ns/1.0'
            'det': 'http://textualcommunities.usask.ca/',
        }
        header_el = tei_el.xpath('/tei:TEI/tei:teiHeader', namespaces=nsmap)[0]
        text_el = tei_el.xpath('/tei:TEI/tei:text', namespaces=nsmap)[0]

        doc_name = header_el.xpath('//tei:sourceDesc/*/@det:document',
                                   namespaces=nsmap)[0]
        # TODO: should parse cref to get this
        tag_list = ['text', 'pb', 'cb', 'lb']
        doc_map = {
            'text': 'document',
            'pb': 'Folio',
            'cb': 'Column',
            'lb': 'Line',
        }
        q = []
        i = 1
        doc_root = prev = {
            'data': {'name': doc_name, 'label': 'document', },
            'tag': 'text', 'children': []
        }
        for el in text_el.xpath('//*[%s]' % (
            ' or '.join(['self::tei:%s' % tag for tag in tag_list[1:]])
        ), namespaces=nsmap):
            tag = el.xpath('local-name()')
            index = tag_list.index(tag)
            if tag_list.index(prev['tag']) < index:
                i = 1
                q.append(prev)
            while q and tag_list.index(q[-1]['tag']) >= index:
                q.pop()
            prev = {
                'data': {'name': el.get('n') or str(i), 'label': doc_map[tag]},
                'tag': tag, 'children': []}
            q[-1]['children'].append(prev)
            i += 1
        doc = Doc.load_bulk([doc_root])[0]
        doc = Doc.objects.get(pk=doc.pk)
        self.doc = doc
        self.save()
        community.docs.add(doc)

        refsdecl_el = header_el.xpath('//tei:refsDecl', namespaces=nsmap)[0]
        root_com = Community.get_root_community()
        try:
            doc_refsdecl = community.refsdecls.get(
                name=refsdecl_el.get('{%s}documentRefsDecl' % nsmap['det']))
        except RefsDecl.DoesNotExist:
            doc_refsdecl = root_com.refsdecls.get(
                name=refsdecl_el.get('{%s}documentRefsDecl' % nsmap['det']))
        name = refsdecl_el.get('{%s}entityRefsDecl' % nsmap['det'])
        try:
            entity_refsdecl = community.refsdecls.get(name=name)
        except RefsDecl.DoesNotExist:
            entity_refsdecl = root_com.refsdecls.get(name=name)

        text_refsdecl_el = etree.Element('refsDecl')
        for refs in (doc_refsdecl, entity_refsdecl):
            tmpl = Template(refs.xml)
            context = Context({
                'community_identifier': community.abbr,
                'document_identifier': doc_name, 
            })
            el = etree.XML(tmpl.render(context))
            for crefpattern in el.getchildren():
                text_refsdecl_el.append(el)

        RefsDecl.objects.create(
            text=self, xml=etree.tostring(text_refsdecl_el),
            template=entity_refsdecl.template)

        doc_xpath, entity_xpath = {}, {}
        for cref in text_refsdecl_el.xpath('//cRefPattern'):
            match = cref.get('matchPattern')
            replace = cref.get('replacementPattern')
            # #xpath(//body/div[@n='$1']) -> //body/div[@n]
            xpath = re.match(r'#xpath\((.+)\)', replace).group(1)
            xpath = re.sub(r'=[\'"]\$\d+[\'"]', '', xpath)
            # urn:det:TCUSask:TC:entity=(.+) -> urn:det:TCUSask:TC:entity=%s
            mp = re.sub(r'\([^\)]+\)', '%s', match)
            if re.findall(r'^(?:\w+:)+document', mp):
                doc_xpath[mp] = xpath
            elif re.findall(r'^(?:\w+:)+entity', mp):
                entity_xpath[mp] = xpath

        for mp, xpath in entity_xpath.items():
            xpath = re.sub('(?<=/)(?=\w)', 'tei:', xpath)
            for el in text_el.xpath(xpath, namespaces=nsmap):
                path = (el.get('n'),)
                for ancestor in el.iterancestors():
                    n = ancestor.get('n')
                    if n:
                        path = (n,) + path
                length = - (len(mp.split('%s')) - 1)
                el.set('{%s}entity' % el.nsmap.get('det'), mp % path[length:])

        docs = list(doc.get_descendants())
        self.load_bulk_el(text_el.getchildren(), docs=docs)
        Header.objects.create(xml=etree.tostring(header_el), text=self)

    @classmethod
    def get_by_urn(cls, urn):
        community_urn = re.findall(r'(^(?:(?:^|:)\w+)+):', urn)[0]
        community = Community.objects.get(abbr=community_urn.split(':')[-1])

        value_pairs = re.findall(r'(?:(\w+)=([^:=]+)(?::|$))', urn)
        obj = None
        doc = None
        entity = None
        # document=Hg:Folio=13r:entity=book1:line=13
        for label, name in value_pairs:
            if label == 'document':
                entity = obj
                qs = community.docs
            elif label == 'entity':
                doc = obj
                qs = community.entities
            else:
                qs = obj.get_children()
            obj = qs.get(name=name, label=label)
        if doc is None:
            doc = obj
        if entity is None:
            entity = obj
        doc_text = doc.has_text_in()
        q = Q(tree_id=doc_text.tree_id, rgt__gt=doc_text.lft)
        bound = doc._get_texts_bound()
        if bound is not None:
            q &= Q(lft__lt=bound.lft)
        return get_last(entity.has_text_of().filter(q))


class Attr(models.Model):
    text = models.ForeignKey(Text)
    name = models.CharField(max_length=63)
    value = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = (('text', 'name'), )


class Header(models.Model):
    xml = models.TextField()
    text = models.ForeignKey(Text)


class Revision(models.Model):
    # only support page level document
    # TODO: add check to make sure doc is a page
    doc = models.ForeignKey(Doc)
    user = models.ForeignKey(User)
    prev = models.ForeignKey(
        'self', related_name='next', null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True)
    commit_date = models.DateTimeField(null=True, blank=True)
    text = models.TextField(blank=True)

    class Meta:
        ordering = ['-create_date', ]

    def _commit_el(self, parent_el, ancestors, after=None):
        bulk_el = parent_el.getchildren()
        parent = ancestors.pop(0)
        if not ancestors:
            if parent_el.text is not None and parent_el.text.strip():
                if after is not None:
                    after.tail += parent_el.text
                    after.save()
                else:
                    parent.text += parent_el.text
                    parent.save()
            if parent_el.tail is not None and parent_el.tail.strip():
                parent.tail = parent_el.tail
                parent.save()
        elif bulk_el:
            self._commit_el(bulk_el.pop(0), ancestors, after=after)

        if bulk_el and (after is None or parent.rgt > after.lft):
            parent.load_bulk_el(bulk_el, after=after)

    def commit(self):
        doc = Doc.objects.get(pk=self.doc.pk)
        root = doc.get_root().has_text_in()
        pb = doc.has_text_in()
        root_el = etree.XML(self.text)
        if 'det' not in root_el.nsmap:
            tmp = etree.XML(
                '<xml xmlns:det="http://textualcommunities.usask.ca/"/>'
            )
            tmp.append(root_el)
        # TODO: verify root_el against cref
        prev_urn = root_el.xpath('//@prev')
        continue_text = None
        if len(prev_urn) > 0:
            continue_text = Text.get_by_urn(prev_urn[-1])

        if pb is not None:
            qs = Text.objects.filter(tree_id=pb.tree_id)
            close_on_page = qs.filter(lft__lt=pb.lft, rgt__gt=pb.lft)
            on_page = qs.filter(lft__gt=pb.lft)
            bound = doc._get_texts_bound()
            continue_to_next_page = []
            if bound is not None:
                close_on_page = close_on_page.filter(rgt__lt=bound.lft)
                on_page = on_page.filter(lft__lt=bound.lft)
                continue_to_next_page = list(on_page.filter(rgt__gt=bound.lft))
                on_page = on_page.filter(rgt__lt=bound.lft)
                close_on_page.update(tail='')

            if continue_text:
                close_on_page = (close_on_page
                                 .filter(rgt__lt=continue_text.rgt)
                                 .order_by('rgt'))
            else:
                close_on_page = (close_on_page
                                 .exclude(tag__in=('text', 'body',))
                                 .order_by('rgt'))
            close_on_page = get_last(close_on_page)
            on_page.delete()
            if close_on_page:
                pb = Text.objects.get(pk=pb.pk)
                pb.move(close_on_page, pos='right')
            pb = Text.objects.get(pk=pb.pk)
        else:
            sibling = get_first(
                root.get_descendants().filter(doc__lft__gte=doc.lft))
            if sibling is None:
                # TODO
                try:
                    body = root.get_children().get(tag='body')
                except Text.DoesNotExist:
                    body = root.add_child(tag='body')
                    body = Text.objects.get(pk=body.pk)
                pb = body.add_child(tag='pb', doc=doc)
            else:
                pb = sibling.add_sibling(pos='left', tag='pb', doc=doc)
            pb = Text.objects.get(pk=pb.pk)

        entity_xpath = {}
        for refsdecl in pb.get_root().refsdecl_set.all():
            refsdecl_el = etree.XML(refsdecl.xml)
            for cref in refsdecl_el.xpath('//cRefPattern'):
                match = cref.get('matchPattern')
                replace = cref.get('replacementPattern')
                # #xpath(//body/div[@n='$1']) -> //body/div[@n]
                xpath = re.match(r'#xpath\((.+)\)', replace).group(1)
                xpath = re.sub(r'=[\'"]\$\d+[\'"]', '', xpath)
                mp = re.sub(r'\([^\)]+\)', '%s', match)
                if re.findall(r'^(?:\w+:)+entity', mp):
                    entity_xpath[mp] = xpath

        for mp, xpath in entity_xpath.items():
            for el in root_el.xpath(xpath):
                path = (el.get('n'),)
                for ancestor in el.iterancestors():
                    n = ancestor.get('n')
                    if n:
                        path = (n,) + path
                length = - (len(mp.split('%s')) - 1)
                el.set('{%s}entity' % el.nsmap.get('det'), mp % path[length:])

        prev_urn = root_el.xpath('//@prev')
        if len(prev_urn) > 0:
            continue_text = Text.get_by_urn(prev_urn[-1])
            prev_text = continue_text.get_child_before(pb)
            if prev_text is None:
                pb.move(continue_text, pos='first-child')
            else:
                pb.move(prev_text, pos='right')
        pb = Text.objects.get(pk=pb.pk)
        doc.get_descendants().delete()
        doc = Doc.objects.get(pk=doc.pk)
        self._commit_el(root_el, list(pb.get_ancestors()), after=pb)
        target = continue_to_next_page[0] if continue_to_next_page else None
        for t in continue_to_next_page:
            t = Text.objects.get(pk=t.pk)
            merge_text = get_first(
                Text.objects.filter(tree_id=t.tree_id, rgt__lt=target.lft, 
                                    entity__isnull=False).order_by('-rgt'))
            if not merge_text or merge_text.entity != t.entity:
                break
            merge_text.tail = t.tail
            for child in t.get_children():
                child = Text.objects.get(pk=child.pk)
                child.move(merge_text, pos='last-child')
                merge_text = Text.objects.get(pk=merge_text.pk)
            t.delete()
            merge_text.save()
            target = merge_text

        # TODO: rebind all doc/entity
        doc.cur_rev = self
        doc.save()

        tag_list = ['cb', 'lb']
        doc_map = {
            'text': 'document',
            'pb': 'Folio',
            'cb': 'Column',
            'lb': 'Line',
        }
        parent = Doc.objects.get(pk=doc.pk)
        index = 1
        for text in doc.get_texts().filter(tag__in=tag_list):
            name = text.get_attr_value('n') or str(index)
            if text.tag == 'cb':
                parent = doc
            parent = Doc.objects.get(pk=parent.pk)
            child = parent.add_child(name=name, label=doc_map[text.tag])
            if text.tag == 'cb':
                parent = child

        self.commit_date = datetime.datetime.utcnow().replace(tzinfo=utc)
        self.save()
        return {'success': 'success'}


def get_path(instance, filename):
    path = os.path.join(instance.base_path(), 'image')
    full_path = os.path.join(settings.MEDIA_ROOT, path)
    if not os.path.isdir(full_path):
        os.makedirs(full_path, 0755)
    return os.path.join(path, filename)


class TilerImage(models.Model):
    image = models.ImageField(
        upload_to=get_path, height_field='height', width_field='width'
    )
    doc = models.OneToOneField(Doc)
    width = models.IntegerField()
    height = models.IntegerField()
    # the length of dir name, so 2 means for doc.pk == 12345
    # we will save image at: 12/34/5/image/foo.jpg
    PATH = 'tiler_image'
    DIR_LENGTH = 2
    TILE_SIZE = 256

    class Meta:
        db_table = 'det_tilerimage'

    def base_path(self):
        doc_pk = str(self.doc_id)
        return os.path.join(self.PATH, *[
            doc_pk[i:i + self.DIR_LENGTH]
            for i in range(0, len(doc_pk), self.DIR_LENGTH)
        ])

    def max_zoom(self):
        return int(math.ceil(
            math.log(max(self.width, self.height) / float(self.TILE_SIZE), 2)
        ))

    def read_tile(self, zoom, x, y):
        if zoom > self.max_zoom():
            raise Tile.DoesNotExist('zoom: %s' % zoom)
        size = 2 ** zoom
        w = float(self.width) / self.TILE_SIZE
        h = float(self.height) / self.TILE_SIZE
        while w > size or h > size:
            w /= 2.0
            h /= 2.0

        if x >= w or y >= h:
            return ''

        try:
            tile = self.tile_set.get(zoom=zoom, x=x, y=y)
        except Tile.DoesNotExist:
            self.image.open()
            tile = self.save_tile(
                Tiler().create_tile(self.image, zoom, x, y), zoom, x, y
            )
        return tile.blob

    def save_tile(self, tile, zoom, x, y):
        blob = StringIO.StringIO()
        tile.save(blob, 'JPEG')
        tile, _ = Tile.objects.get_or_create(
            image=self, zoom=zoom, x=x, y=y,
            blob_base64=base64.encodestring(blob.getvalue()))
        blob.close()
        return tile


class Base64Field(models.Field):

    def db_type(self, connection):
        return 'blob'

    def contribute_to_class(self, cls, name):
        if self.db_column is None:
            self.db_column = name
        self.field_name = name + '_base64'
        super(Base64Field, self).contribute_to_class(cls, self.field_name)
        setattr(cls, name, property(self.get_data, self.set_data))

    def get_data(self, obj):
        return base64.decodestring(getattr(obj, self.field_name))

    def set_data(self, obj, data):
        setattr(obj, self.field_name, base64.encodestring(data))


class Tile(models.Model):
    image = models.ForeignKey(TilerImage)
    zoom = models.IntegerField()
    x = models.IntegerField()
    y = models.IntegerField()
    blob = Base64Field()

    class Meta:
        unique_together = (('image', 'zoom', 'x', 'y'), )
        db_table = 'det_tile'


def css_upload_to(instance, filename):
    path = os.path.join('css', str(instance.community_id))
    full_path = os.path.join(settings.MEDIA_ROOT, path)
    if not os.path.isdir(full_path):
        os.makedirs(full_path, 0755)
    return os.path.join(path, filename)


class CSS(models.Model):
    community = models.ForeignKey(Community)
    css = models.FileField(upload_to=css_upload_to, verbose_name='CSS')

    class Meta:
        db_table = 'det_css'

    def name(self):
        return os.path.basename(self.css.name)


def schema_upload_to(instance, filename):
    path = os.path.join('schema', str(instance.community_id))
    full_path = os.path.join(settings.MEDIA_ROOT, path)
    if not os.path.isdir(full_path):
        os.makedirs(full_path, 0755)
    return os.path.join(path, filename)


class Schema(models.Model):
    community = models.ForeignKey(Community)
    schema = models.FileField(upload_to=schema_upload_to)

    class Meta:
        unique_together = ('community', 'schema', )

    def name(self):
        return os.path.basename(self.schema.name)


def js_upload_to(instance, filename):
    path = os.path.join('js', str(instance.community_id))
    full_path = os.path.join(settings.MEDIA_ROOT, path)
    if not os.path.isdir(full_path):
        os.makedirs(full_path, 0755)
    return os.path.join(path, filename)


class JS(models.Model):
    community = models.ForeignKey(Community)
    js = models.FileField(upload_to=js_upload_to, verbose_name='Javascript')

    def name(self):
        return os.path.basename(self.js.name)


class RefsDecl(models.Model):
    DOC_TYPE, ENTITY_TYPE, TEXT_TYPE = range(3)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    type = models.IntegerField(choices=(
        (DOC_TYPE, 'document'),
        (ENTITY_TYPE, 'entity'),
        (TEXT_TYPE, 'text'),
    ), default=TEXT_TYPE)
    text = models.ForeignKey(Text, null=True, blank=True)
    xml = models.TextField()
    template = models.TextField(blank=True)

    def __unicode__(self):
        display_name = self.name
        if self.description:
            display_name += ' - ' + self.description
        return display_name


class APIUser(User):
    class Meta:
        proxy = True

    def communities(self):
        return self.community_set.distinct()

    def memberships(self):
        return self.membership_set.all()


class Task(models.Model):
    ASSIGNED, IN_PROGRESS, SUBMITTED, COMPLETED = range(4)
    STATUS_CHOICES = (
        (ASSIGNED, 'assigned'),
        (IN_PROGRESS, 'in_progress'),
        (SUBMITTED, 'submitted'),
        (COMPLETED, 'completed'),
    )
    doc = models.ForeignKey(Doc, editable=False)
    membership = models.ForeignKey(Membership)
    status = models.IntegerField(choices=STATUS_CHOICES, default=ASSIGNED)

    class Meta:
        unique_together = ('doc', 'membership', )

class Partner(models.Model):
    name = models.CharField(max_length=80, unique=True, db_index=True)
    sso_url = models.URLField()

    class Meta:
        db_table = 'community_partner'

    def __unicode__(self):
        return unicode(self.name)

    def get_community(self, mapping_id=None):
        return self.communitymapping_set.get(mapping_id=mapping_id).community

    def get_user(self, mapping_id):
        return self.usermapping_set.get(mapping_id=mapping_id).user


class PartnerMapping(models.Model):
    partner = models.ForeignKey(Partner)
    mapping_id = models.IntegerField(null=False, blank=False)

    class Meta:
        abstract = True
        unique_together = ('partner', 'mapping_id')
        db_table = 'community_partnermapping'


class CommunityMapping(PartnerMapping):
    community = models.OneToOneField(Community)

    class Meta:
        db_table = 'community_communitymapping'

    def get_friendly_url(self):
        url = settings.PARTNER_URL + 'get-group'
        values = {'groupId': self.mapping_id}
        data = urllib.urlencode(values)
        req = urllib2.Request(url, data)
        resp = urllib2.urlopen(req)
        resp_json = json.loads(resp.read())
        return settings.PARTNER_BASE + '/web' + resp_json['friendlyURL']

    def rss(self):
        url = '%s/home/-/activities/rss' % self.get_friendly_url()
        feed = feedparser.parse(url)
        dates = {}
        for entry in feed.entries:
            date = entry.updated.split('T')[0]
            if date not in dates:
                dates[date] = []
            dates[date].append(entry)
        return dates


class UserMapping(PartnerMapping):
    user = models.OneToOneField(User)

    class Meta:
        db_table = 'community_usermapping'

    def __unicode__(self):
        return u'%s %s %s' % (self.user, self.partner, self.mapping_id)


class Invitation(models.Model):
    invitor = models.ForeignKey(Membership, related_name='+')
    invitee = models.OneToOneField(Membership)
    email_content = models.TextField(blank=True)
    code = models.CharField(max_length=32, db_index=True)
    invited_date = models.DateTimeField(auto_now_add=True)
    accepted_date = models.DateTimeField(blank=True, null=True)

    def __unicode__(self):
        return unicode('%s' % self.invitee)

    def is_activated(self):
        return self.accepted_date != None

    def activate(self):
        if not self.is_activated():
            self.accepted_date = datetime.datetime.now()
            self.save()

    def invite_url(self):
        return '%s%s?code=%s&partner=1' % (
            settings.BASE_URL, reverse('myauth:activate'), self.code)

    def send_invitation(self):
        subject = 'Welcome to %s' % self.invitee.community.name
        from_email = 'noreply@textualcommunities.usask.ca'
        recipient_list = [self.invitee.user.email]
        data = {'invitation': self}
        context = Context(data)
        html_template = loader.get_template('invitation.html')
        text_template = loader.get_template('invitation.txt')

        # TODO: exception handle
        # errno 61, Connection refused
        mail_msg = EmailMultiAlternatives(
            subject, text_template.render(context), from_email, recipient_list)
        mail_msg.attach_alternative(html_template.render(context), 'text/html')
        mail_msg.send()

class Action(models.Model):
    community = models.ForeignKey(Community)
    user = models.ForeignKey(User)

    action = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)

    data = JSONField(blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    key = models.CharField(max_length=36, db_index=True)

    class Meta:
        ordering = ('-modified', )

    def get_status(self):
        if self.key:
            result = AsyncResult(self.key)
            if result.status == 'FAILURE':
                return result.status + '\n' + str(result.traceback)
            return result.status
        else:
            return 'SUCCESS'

