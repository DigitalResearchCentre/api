from django.db import models
from hierarchy.utils import NumConv

class MP_Node(models.Model):

    @classmethod
    def add_root(cls, **kwargs):
        raise NotImplementedError

    @classmethod
    def load_bulk(cls, bulk_data, parent=None, keep_ids=False):
        raise NotImplementedError

    @classmethod
    def dump_bulk(cls, parent=None, keep_ids=True):
        raise NotImplementedError

    def get_descendants(self):
        raise NotImplementedError

    def get_children(self):
        raise NotImplementedError

    def get_next_sibling(self):
        raise NotImplementedError

    def get_prev_sibling(self):
        raise NotImplementedError





