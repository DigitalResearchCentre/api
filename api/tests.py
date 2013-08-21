import re
from django.test import TestCase
from django.test.client import Client
from django.contrib.auth.models import User
from api.models import Revision, Doc, Text, Community, RefsDecl

TEST_XML = '''
<text>
<body>
    <pb n="2r"/>
    <lb/>
    <div n="Header_W1a-4338-212r-1">
        <head>:W:1a:</head>
        <lb/><p> </p>
    </div>
    <lb/>
    <div n="False_Conception-4338-212r-2">
        <head>Dr Willis for one that had a False Conception</head>
        <note resp="LWS">False Conception: </note> 
        <pb n="2v"/>
        <lb/>
        <p> 
            Anoynt her Belly well &amp; rub it in with a warme hand &amp; lay a
            <lb/>paper or cloth spread with the same upon her Belly
            <lb/>Briony rootes slived one pound middle Bark of elder 2 good
        </p>
        <lb/>
        <p>
            give her a Glyster 3 or 4 times in a weeke a pint of urin
            <lb/>disolve in it 2 spoonfuls of venes Turpentine first mixed
            <lb/>with the yolk of an egge then with the Turpentine
        </p>
    </div>
</body>
</text>
'''

TEST_TEI = '''
<TEI xmlns="http://www.tei-c.org/ns/1.0" 
    xmlns:det="http://textualcommunities.usask.ca/">
    <teiHeader>
        <fileDesc>
            <sourceDesc>
                <bibl det:document="Hg"/>
            </sourceDesc>
        </fileDesc>
        <encodingDesc>
            <refsDecl det:documentRefsDecl="Manuscript" 
                det:entityRefsDecl="Text"/>
        </encodingDesc>
    </teiHeader>
    %s
</TEI>
''' % TEST_XML

TEST_REFS_M = '''
<refsDecl>
    <cRefPattern matchPattern="urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+)"
        replacementPattern="#xpath(//pb[@n='$1'])">
        <p>This pointer pattern extracts and references a pb element for each folio.</p>
    </cRefPattern>
    <cRefPattern matchPattern="urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+):Column=(.+)"
        replacementPattern="#xpath(//pb[@n='$1']/following::cb[@n='$2'])">
        <p>This pointer pattern extracts and references a cb element within a pb element for each folio.</p>
    </cRefPattern>
    <cRefPattern matchPattern="urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+):Column=(.+):Line=(.+)"
        replacementPattern="#xpath(//pb[@n='$1']/following::cb[@n='$2']/following::lb[@n='$3'])">
        <p>This pointer pattern extracts and references a lb element within cb element within a pb element for each folio.</p>
    </cRefPattern>
    <cRefPattern matchPattern="urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+):Line=(.+)"
        replacementPattern="#xpath(//pb[@n='$1']/following::lb[@n='$2'])">
        <p>This pointer pattern extracts and references a lb element within a pb element for each folio.</p>
    </cRefPattern>
</refsDecl>
'''

TEST_REFS_E = '''
<refsDecl>
  <cRefPattern matchPattern="urn:det:TCUSask:CT2:entity=Tales:Group=(.+)" replacementPattern="#xpath(//body/div[@n='$1'])">
    <p>This pointer pattern extracts and references each tale group, as  a top-level div,  as an entity</p>
  </cRefPattern>
  <cRefPattern matchPattern="urn:det:TCUSask:CT2:entity=Tales:Group=(.+):Line=(.+)" replacementPattern="#xpath(//body/div[@n='$1']/l[@n='$2'])">
    <p>For poetry: this pointer pattern extracts and references each line element contained in a group as an entity</p>
  </cRefPattern>
  <cRefPattern matchPattern="urn:det:TCUSask:CT2:entity=Tales:Group=(.+):Segment=(.+)" replacementPattern="#xpath(//body/div[@n='$1']/ab[@n='$2'])">
    <p>For prose: this pointer pattern extracts and references each ab element contained in a div as an entity</p>
  </cRefPattern>
</refsDecl>
'''

class RevisionTestCase(TestCase):
    def setUp(self):
        user = User.objects.create_user('test', 'test@test.com', 'password')
        doc = Doc.add_root(name='Hg', label='document')
        self.com = com = Community.objects.create()
        com.docs.add(doc)
        pb = doc.add_child(name='1r', label='pb')
        text = Text.add_root(tag='text', doc=doc)
        body = text.add_child(tag='body')
        body.add_child(tag='pb', doc=pb)
        self.rev = Revision.objects.create(doc=pb, user=user, text=TEST_XML)
        refs = RefsDecl.objects.create(
            name='Manuscript', type=RefsDecl.DOC_TYPE, xml=TEST_REFS_M
        )
        com.refsdecls.add(refs)
        refs = RefsDecl.objects.create(
            name='Text', type=RefsDecl.ENTITY_TYPE, xml=TEST_REFS_E
        )
        com.refsdecls.add(refs)

    def test_commit(self):
        self.rev.commit()
        self.assertEqual(
            re.sub('\s+', '', TEST_XML).strip(),
            re.sub('\s+', '', self.rev.doc.xml()[0]).strip())
        self.rev.commit()
        self.assertEqual(
            re.sub('\s+', '', TEST_XML).strip(),
            re.sub('\s+', '', self.rev.doc.xml()[0]).strip())

    def test_load_tei(self):
        text = Text.load_tei(TEST_TEI, self.com)
        doc = text.doc
        pbs = doc.get_children()
        r = pbs[0]
        v = pbs[1]
        client = Client()
        resp = client.post('/docs/%s/transcribe/' % r.pk,
                           {'user': 1, 'text': r.xml()})
        rev = r.has_revisions()[0]
        rev.commit()
        print rev.text
        rev.commit()
        rev.commit()

        print r.cur_revision().text
        print text.xml()



