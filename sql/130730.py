

class OldRefsDecl(models.Model):
    DOC_TYPE, ENTITY_TYPE, TEXT_TYPE = range(3)
    name = models.CharField(max_length=255)
    description = models.TextField()
    type = models.IntegerField(choices=(
        (DOC_TYPE, 'document'),
        (ENTITY_TYPE, 'entity'),
        (TEXT_TYPE, 'text'),
    ), default=TEXT_TYPE)
    text_el = models.OneToOneField(
        Element, null=True, blank=True, 
        related_name='refs_decl', editable=False,
    )
    template = models.OneToOneField(
        Element, null=True, blank=True,
        related_name='template_refs_decl', editable=False,
    )

    class Meta:
        db_table = 'det_refsdecl'

    def __unicode__(self):
        display_name = self.name
        if self.description:
            display_name += ' - ' + self.description
        return display_name

    def parse_xml(self, xml):
        root = etree.XML(xml)
        for pattern in root.xpath('//cRefPattern'):
            description = pattern.text
            for child in pattern.iterchildren():
                description += etree.tostring(child)
            CRefPattern.objects.create(
                refs_decl=self,
                match=pattern.attrib['matchPattern'],
                replacement=pattern.attrib['replacementPattern'],
                description=description
            )

    def xml(self, pretty_print=True):
        root = etree.Element('refsDecl')
        for pattern in self.crefpattern_set.all():
            el = etree.SubElement(root, 'cRefPattern')
            el.attrib['matchPattern'] = pattern.match
            el.attrib['replacementPattern'] = pattern.replacement
            el.append(etree.XML(pattern.description))
        return etree.tostring(root, pretty_print=pretty_print)

    def json(self):
        return {
            'name': self.name,
            'description': self.description,
            'type': self.get_type_display(),
            'xml': self.xml(),
        }


for o in OldRefsDecl.objects.all():
    try:
        r = RefsDecl.objects.get(pk=o.pk)
    except:
        continue
    r.xml = o.xml() or ''
    try:
        t = o.template
        r.template = t.xml() or ''
    except:
        pass
    r.save()
