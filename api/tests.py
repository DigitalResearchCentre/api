import re
from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Revision, Doc, Text, Community

TEST_XML = '''
<text>
<body>
    <lb/>
    <div n="Header_W1a-4338-212r-1">
        <head>:W:1a:</head>
        <lb/><p> </p>
    </div>
    <lb/>
    <div n="False_Conception-4338-212r-2">
        <head>Dr Willis for one that had a False Conception</head>
        <note resp="LWS">False Conception: </note> 
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

class RevisionTestCase(TestCase):
    def setUp(self):
        user = User.objects.create_user('test', 'test@test.com', 'password')
        doc = Doc.add_root(name='Hg', label='document')
        com = Community.objects.create()
        com.docs.add(doc)
        pb = doc.add_child(name='1r', label='pb')
        text = Text.add_root(tag='text', doc=doc)
        body = text.add_child(tag='body')
        body.add_child(tag='pb', doc=pb)
        self.rev = Revision.objects.create(doc=pb, user=user, text=TEST_XML)

    def test_commit(self):
        self.rev.commit()
        self.assertEqual(
            re.sub('\s+', '', TEST_XML).strip(),
            re.sub('\s+', '', self.rev.doc.xml()[0]).strip())
        self.rev.commit()
        self.assertEqual(
            re.sub('\s+', '', TEST_XML).strip(),
            re.sub('\s+', '', self.rev.doc.xml()[0]).strip())


