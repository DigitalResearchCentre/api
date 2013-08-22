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
<lb/><l n="3">I may nat slepe/ wel nygh noght</l>
<lb/><l n="4">I have so many/ an ydel thoght</l>
<lb/><l n="5">Purely/ for defaulte of slepe</l>
<lb/><l n="6">That by my trouthe/ I take no kepe</l>
<lb/><l n="7">Of noo thinge/ how hyt cometh or gooth</l>
<lb/><l n="8">Ne me nys no thynge/ leve nor looth</l>
<lb/><l n="9">Al is ylyche goode/ to me</l>
<lb/><l n="10">Ioy or sorowe/ wherso hyt be</l>
<lb/><l n="11">ffor I haue felynge/ in no thynge</l>
<lb/><l n="12">But as yt were/ a mased thynge</l>
<lb/><l n="13">Alway in poynt/ to falle a dovun'</l>
<lb/><l n="14">ffor sorwful/ ymagynacioun'</l>
<lb/><l n="15">Ys alway hooly/ in my mynde</l>
<lb/><l n="16">And wel ye woote/ agaynes kynde</l>
<lb/><l n="17">Hyt were to lyven'/ in thys wyse</l>
<lb/><l n="18">ffor nature/ wolde nat suffyse</l>
<lb/><l n="19">To noon' ertherly/ creature</l>
<lb/><l n="20">Nat longe tyme/ to endure</l>
<lb/><l n="21">With oute slepe/ and be in sorwe</l>
<lb/><l n="22">And I ne may/ no nyght ne morwe</l>
<lb/><l n="23">Slepe/ and thys Melancolye</l>
<lb/><l n="24">And drede I haue/ for to dye</l>
<lb/><l n="25">Defaulte of slepe/ and hevynesse</l>
<lb/><l n="26">Hath my spirite/ of quyknesse</l>
<lb/><l n="27">That I haue loste/ al lustyhede</l>
<lb/><l n="28">Suche fantasies/ ben in myn' hede</l>
<lb/><l n="29">So I not what/ is best too doo</l>
<lb/><l n="30">But men' myght axeme/ why soo</l>
  <lb/><l n="31">I may not sleepe, and what me is</l>
  <lb/><l n="32">But nathles, whoe aske this</l>
  <lb/><l n="33">Leseth his asking trewly</l>
  <lb/><l n="34">My seluen can not tell why</l>
  <lb/><l n="35">The southe, but trewly as I gesse</l>
  <lb/><l n="36">I hold it be a sicknes</l>
  <lb/><l n="37">That I haue suffred this eight yeere</l>
  <lb/><l n="38">And yet my boote is neuer the nere</l>
<pb n="130v" facs="FF130V.JPG"/>            
  <lb/><l n="39">For there is phisicien but one</l>
  <lb/><l n="40">That may me heale, but that is done</l>
  <lb/><l n="41">Passe we ouer vntill efte</l>
  <lb/><l n="42">That will not be, mote nedes be lefte</l>
  <lb/><l n="43">Our first mater is good to kepe</l>
  <lb/><l n="44">Soe when I sawe I might not slepe</l>
  <lb/><l n="45">Til now late, this other night</l>
  <lb/><l n="46">Vpon my bedde I sate vpright</l>
  <lb/><l n="47">And bade one reche me a booke</l>
  <lb/><l n="48">A Romaunce, and it me toke</l>
  <lb/><l n="49">To rede, and driue the night away</l>
  <lb/><l n="50">For me thought it beter play</l>
  <lb/><l n="51">Then play either at Chesse or tables</l>
  <lb/><l n="52">And in this boke were written fables</l>
  <lb/><l n="53">That Clerkes had in olde tyme</l>
  <lb/><l n="54">And other poets put in rime</l>
  <lb/><l n="55">To rede, and for to be in minde</l>
  <lb/><l n="56">While men loued the lawe in kinde</l>
  <lb/><l n="57">This boke ne speake, but of such thinges</l>
  <lb/><l n="58">Of quenes liues, and of kings</l>
  <lb/><l n="59">And many other things smalle</l>
  <lb/><l n="60">Amonge all this I fonde a tale</l>
  <lb/><l n="61">That me thought a wonder thing.</l>
  <lb/><l n="62">This was the tale: There was a king</l>
  <lb/><l n="63">That hight Seyes, and had a wife</l>
  <lb/><l n="64">The best that might beare lyfe</l>
  <lb/><l n="65">And this quene hight Alcyone</l>
  <lb/><l n="66">Soe it befill, thereafter soone</l>
  <lb/><l n="67">This king woll wenden ouer see</l>
  <lb/><l n="68">To tellen shortly, whan that he</l>
  <lb/><l n="69">Was in the see, thus in this wise</l>
  <lb/><l n="70">Soche a tempest gan to rise</l>
  <lb/><l n="71">That brake her maste, and made it fal</l>
  <lb/><l n="72">And cleft ther ship, and dreint hem all</l>
  <lb/><l n="73">That neuer was founde, as it telles</l>
  <lb/><l n="74">Borde ne man, ne nothing elles</l>
  <lb/><l n="75">Right thus this king Seyes loste his life</l>
  <lb/><l n="76">Now for to speake of Alcyone his wife</l>
  <lb/><l n="77">This Lady that was left at home</l>
  <lb/><l n="78">Hath wonder, that the king ne come</l>
  <lb/><l n="79">Home, for it was a long terme</l>
  <lb/><l n="80">Anone her herte began to yerne</l>
  <lb/><l n="81">And for that her thought euermo</l>
  <lb/><l n="82">It was not wele, her thought soe</l>
  <lb/><l n="83">She longed soe after the king</l>
  <lb/><l n="84">That certes it were a pitous thing</l>
  <lb/><l n="85">To tell her hartely sorowfull life</l>
  <lb/><l n="86">That she had, this noble wife</l>
  <lb/><l n="87">For him alas, she loued alderbeste</l>
  <lb/><l n="88">Anone she sent both eeste and weste</l>
  <lb/><l n="89">To seke him, but they founde nought</l>
  <lb/><l n="90">Alas (quoth shee) that I was wrought</l>
  <lb/><l n="91">And where my lord my loue be deed:</l>
  <lb/><l n="92">Certes I will neuer eate breede</l>
  <lb/><l n="93">I make a uowe to my god here</l>
  <lb/><l n="94">But I mowe of my Lord here.</l>
  <lb/><l n="95">Soche sorowe this Lady to her toke</l>
  <lb/><l n="96">That trewly I which made this booke<note rend="br">[Catchword:]Had such</note></l>

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
        text = Text.load_tei(NEW_TEST, self.com)
        doc = text.doc
        pbs = doc.get_children()
        r = pbs[0]
        v = pbs[1]
        client = Client()
        resp = client.post('/docs/%s/transcribe/' % r.pk,
                           {'user': 1, 'text': r.xml()})

        rev = r.has_revisions()[0]
        rev.commit()
        doc = Doc.objects.get(pk=doc.pk)
        for p in doc.get_children():
            print p.xml()
        print text.xml()
        rev.commit()
        rev.commit()




