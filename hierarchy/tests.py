from django.conf import settings
from django.test import TestCase
from django.db import connection

from hierarchy.utils import NumConv
from hierarchy.models import Node

class NumConvTest(TestCase):
    def setUp(self):
        self.numconv = NumConv(alphabet=map(chr, range(0, 128)))

    def test_num2str(self):
        nc = self.numconv
        self.assertEqual('\x00', nc.num2str(0))
        self.assertEqual('\x0A', nc.num2str(10))
        self.assertEqual('\x01\x00', nc.num2str(128))

        self.assertEqual('\x00\x00\x00', nc.num2str(0, 3))
        self.assertEqual('\x00\x00\x0A', nc.num2str(10, 3))
        self.assertEqual('\x00\x01\x00', nc.num2str(128, 3))

        self.assertEqual('\x01\x00\x00\x00', nc.num2str(128*128*128, 3))

    def test_str2num(self):
        nc = self.numconv
        self.assertEqual(0, nc.str2num('\x00\x00\x00'))
        self.assertEqual(10, nc.str2num('\x00\x00\x0A'))
        self.assertEqual(128, nc.str2num('\x00\x01\x00'))

class TreeTest(TestCase):
    @staticmethod
    def setUpClass():
        settings.DEBUG = True

    def test_foo(self):
        a = Node.objects.create(n='a')
        aa = a.add_child(n='aa')
        ab = a.add_child(n='ab')
        aaa = aa.add_child(n='aaa')
        aaaa = aaa.add_child(n='aaaa')
        print Node.objects.count()
        print Node.get_descendants(a.pk)
        print Node.get_children(a.pk)

        for q in connection.queries:
            print q
