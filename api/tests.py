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
  <cRefPattern matchPattern="urn:det:TCUSask:CT2:entity=(.+)" replacementPattern="#xpath(//body/div[@n='$1'])">
    <p>This pointer pattern extracts and references each tale group, as  a top-level div,  as an entity</p>
  </cRefPattern>
  <cRefPattern matchPattern="urn:det:TCUSask:CT2:entity=(.+):Line=(.+)" replacementPattern="#xpath(//body/div[@n='$1']/l[@n='$2'])">
    <p>For poetry: this pointer pattern extracts and references each line element contained in a group as an entity</p>
  </cRefPattern>
  <cRefPattern matchPattern="urn:det:TCUSask:CT2:entity=(.+):Head=(.+)" replacementPattern="#xpath(//body/div[@n='$1']/head[@n='$2'])">
    <p>For poetry: this pointer pattern extracts and references each line element contained in a group as an entity</p>
  </cRefPattern>
  <cRefPattern matchPattern="urn:det:TCUSask:CT2:entity=(.+):Segment=(.+)" replacementPattern="#xpath(//body/div[@n='$1']/ab[@n='$2'])">
    <p>For prose: this pointer pattern extracts and references each ab element contained in a div as an entity</p>
  </cRefPattern>
</refsDecl>
'''

NEW_TEST = '''<?xml version="1.0" ?> 
<!DOCTYPE TEI SYSTEM "../common/chaucerTC.dtd">
<TEI xmlns="http://www.tei-c.org/ns/1.0"  xmlns:det="http://textualcommunities.usask.ca/">
 	<teiHeader>
 		<fileDesc>
 			<titleStmt>
 				<title>Hg</title>
 					<respStmt>
 						<resp>Textual editing and encoding:</resp>
 						<name>Peter Robinson, based on the HTML files published by Murray McGillivray</name>
 						<resp>Original data preparation:</resp>
 						<name>Murray McGillivray</name>
 					</respStmt>
 			</titleStmt>
 			<publicationStmt>
 				<p>Draft for Textual Communities site</p>
 			</publicationStmt>
 			<notesStmt>
 				<note>Converted for the Textual Communities project, August 2013</note>
 			</notesStmt>
 			<sourceDesc>
 				<bibl det:document="FF5"></bibl>
 			</sourceDesc>
 		</fileDesc>
 		<encodingDesc>
   			<refsDecl det:documentRefsDecl="Manuscript"  det:entityRefsDecl="Text">
 	 			</refsDecl>
 		</encodingDesc>
 	</teiHeader>
	<text>
		<body>
		<pb n="130r" facs="FF130R.JPG"/>
			<lb/><div n="Book of the Duchess">
	<note rend="tm">130<note resp="PR">Pencil foliation</note></note>
<head n="1">The booke of the Duchesse<note rend="marg-right">made by Geffrey
Chawcyer at ye request of ye duke of lancastar: pitiously 
complaynynge the deathe of ye sayd duchesse/ blanche/</note></head>
<lb/><l n="1">I Haue grete wonder/ be this lyghte</l>
<lb/><l n="2">How that I lyve/ for day ne nyghte</l>
<pb n="130v" facs="FF130V.JPG"/>            
<lb/><l n="3">I may nat slepe/ wel nygh noght</l>
<lb/><l n="4">I have so many/ an ydel thoght</l>
<lb/><l n="5">Purely/ for defaulte of slepe</l>
<lb/><l n="6">That trewly I which made this booke<note rend="br">[Catchword:]Had such</note></l>
<pb n="131r" facs="FF131R.JPG"/> 
<pb n="131v" facs="FF131V.JPG"/> 
<pb n="132r" facs="FF131V.JPG"/> 
<pb n="132v" facs="FF131V.JPG"/> 
<pb n="133r" facs="FF131V.JPG"/> 
</div>
</body>
</text>
</TEI>
'''

class RevisionTestCase(TestCase):
    def setUp(self):
        self.user = user = User.objects.create_user(
            'test', 'test@test.com', 'password'
        )
        doc = Doc.add_root(name='Hg', label='document')
        root_com = Community.objects.create(abbr='TC',
                                            name='Textual Community')
        self.com = com = Community.objects.create(abbr='CT2')
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
        text = Text.load_tei(NEW_TEST, self.com)
        self.assertEqual(
            re.sub('\s+', '', text.xml()).strip(),
            re.sub('\s+', '', '''<body>
		<pb facs="FF130R.JPG" n="130r"/>
			<lb/><div n="Book of the Duchess">
	<note rend="tm">130<note resp="PR">Pencil foliation</note></note>
<head n="1">The booke of the Duchesse<note rend="marg-right">made by Geffrey
Chawcyer at ye request of ye duke of lancastar: pitiously 
complaynynge the deathe of ye sayd duchesse/ blanche/</note></head>
<lb/><l n="1">I Haue grete wonder/ be this lyghte</l>
<lb/><l n="2">How that I lyve/ for day ne nyghte</l>
<pb facs="FF130V.JPG" n="130v"/>            
<lb/><l n="3">I may nat slepe/ wel nygh noght</l>
<lb/><l n="4">I have so many/ an ydel thoght</l>
<lb/><l n="5">Purely/ for defaulte of slepe</l>
<lb/><l n="6">That trewly I which made this booke<note rend="br">[Catchword:]Had such</note></l>
<pb facs="FF131R.JPG" n="131r"/> 
<pb facs="FF131V.JPG" n="131v"/> 
<pb facs="FF131V.JPG" n="132r"/> 
<pb facs="FF131V.JPG" n="132v"/> 
<pb facs="FF131V.JPG" n="133r"/> 
</div>
</body>''').strip())

        for e in self.com.entities.all():
            print e.name
            for child in e.get_children():
                print '\t', child.name
        pb = text.doc.get_children()[2]
        print pb.xml()
        rev = Revision.objects.create(
            doc=pb, user=self.user, 
            text='<text><body><div n="Book of the Duchess" prev="urn:det:TCUSask:CT2:document=FF5:Folio=130v:Line=4:entity=Book of the Duchess"><lb/><l n="new-after-6">test new page</l>\n</div>\n</body>\n</text>'
        )
        rev.commit()

        for e in self.com.entities.all():
            print e.name
            for child in e.get_children():
                print '\t', child.name
        print text.xml()




