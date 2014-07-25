from django.test import TestCase
from hierarchy.utils import NumConv

class NumConvTest(TestCase):
    def setUp(self):
        self.numconv = NumConv(radix=128, alphabet=map(chr, range(0, 128)))

    def test_num2str(self):
        nc = self.numconv
        self.assertEqual('\x00', nc.num2str(0))
        self.assertEqual('\x0A', nc.num2str(10))
        self.assertEqual('\x01\x00', nc.num2str(128))

        self.assertEqual('\x00\x00\x00', nc.num2str(0, 3))
        self.assertEqual('\x00\x00\x0A', nc.num2str(10, 3))
        self.assertEqual('\x00\x01\x00', nc.num2str(128, 3))

    def test_str2num(self):
        nc = self.numconv
        self.assertEqual(0, nc.str2num('\x00\x00\x00'))
        self.assertEqual(10, nc.str2num('\x00\x00\x0A'))
        self.assertEqual(128, nc.str2num('\x00\x01\x00'))

