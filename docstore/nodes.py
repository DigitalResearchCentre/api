from collections import deque
from pymongo.errors import BulkWriteError
from bson.objectid import ObjectId

from docstore import settings

MONGO_DATABASE = settings.MONGO_DATABASE
client = settings.client
db = settings.db
collection = db.nodes

# TODO: AutoReconnect

class Logger(object):
    objects = db.logs

    @classmethod
    def log(cls, data):
        return cls.objects.insert_one(data)

class InvalidPositionException(Exception):
    pass


def get_tree(_id):
    return collection.find({
        '$or': [{'_id': _id}, {'ancestors': _id}],
    })

def get_node(_id):
    return collection.find_one({'_id': _id})

def insert_one(parent_id=None, ancestors=[], next_id=None, data={}, **kwargs):
    # first_child_id is optional, don't need set it 
    node = {
        'parent_id': parent_id, 'ancestors': ancestors, 'next_id': next_id,
        'data': data,
    }
    node.update(kwargs)
    return collection.insert_one(node)

def prepend(node, data):
    _id = ObjectId()
    next_id = node['_id']
    parent_id = node['parent_id']
    ancestors = node['ancestors']

    prev = collection.find_one_and_update(
        {'next_id': next_id},
        {'$set': {'next_id': _id}},
    )
    if not prev:
        collection.find_one_and_update(
            {'_id': parent_id},
            {'$set': {'first_child_id': _id}},
        )

    try:
        return insert_one(
            _id=_id, parent_id=parent_id, ancestors=ancestors,
            next_id=next_id, data=data)
    except Exception as e:
        if prev:
            collection.find_one_and_update(
                {'_id': prev['_id']},
                {'$set': {'next_id': next_id}}
            )
        else:
            collection.find_one_and_update(
                {'_id': parent_id},
                {'$set': {'first_child_id': prev['_id']}},
            )
        raise e

def append(node, data):
    _id = ObjectId()
    parent_id = node['parent_id']
    ancestors = node['ancestors']
    next_id = node['next_id']
    node_id = node['_id']

    collection.find_one_and_update({
        {'_id': node_id},
        {'$set': {'next_id': _id}},
    })

    try:
        return insert_one(
            _id=_id, parent_id=parent_id, ancestors=ancestors,
            next_id=next_id, data=data)
    except Exception as e:
        collection.find_one_and_update(
            {'_id': node_id},
            {'$set': {'next_id': next_id}}
        )
        raise e

def add_first_child(node, data):
    _id = ObjectId()
    parent_id = node['_id']
    ancestors = node['ancestors'] + [parent_id]
    next_id = node.get('first_child_id', None)

    collection.find_one_and_update(
        {'_id': parent_id},
        {'$set': {'first_child_id': _id}},
    )

    try:
        return insert_one(
            _id=_id, parent_id=parent_id, ancestors=ancestors,
            next_id=next_id, data=data)
    except Exception as e:
        collection.find_one_and_update(
            {'_id': parent_id},
            {'$set': {'first_child_id': next_id}}
        )
        raise e



class Node(object):
    objects = db.nodes

    @classmethod
    def __init__(self, parent_id=None, next_id=None, first_child_id=None, 
                 ancestors=[], **kwargs):
        self._id = ObjectId()
        self.next_id = next_id
        self.parent_id = parent_id
        self.first_child_id = first_child_id
        self.ancestors = ancestors
        self.data = kwargs



    def get_last_child(self):
        objects = self.objects
        return objects.find_one({'parent': self.parent, 'next': None})

    def load_bulk_children(self, children_data, append_after=None):
        # children format: {
        #   data: {foo: bar}, 
        #   children: [{
        #     data: {foo: bar},
        #     children: [],
        #   }],
        # }
        parent = {
            '_id': self._id,
            'ancestors': self.ancestors,
            'children': children_data,
        }
        objs = []
        q = deque()
        q.append(parent)
        while q:
            parent = q.popleft()
            objs.append(parent)
            parent_id = parent['_id']
            ancestors = parent['ancestors'] + [parent_id]
            prev = None

            for child in parent.pop('children', []):
                obj = {
                    '_id': ObjectId(),
                    'parent_id': parent_id,
                    'next_id': None,
                    'ancestors': ancestors,
                    'children': child.get('children', []),
                    'data': child.get('data', {}),
                }
                if prev:
                    prev['next_id'] = obj['_id']
                else:
                    parent['first_child_id'] = obj['_id']
                prev = obj
                q.append(obj)

        # pop root, since root already in database
        root = objs.pop(0)
        objects = self.objects
        if objs:
            orig_first_child_id = self.first_child_id
            first_child = objs[0]
            last_child = None
            # find all direct children
            children_ids = []
            for obj in objs:
                children_ids.append(obj['_id'])
                if obj['next_id'] is None:
                    last_child = obj
                    break
            if append_after:
                last_child['next_id'] = append_after.next_id
                objects.find_one_and_update(
                    {'_id': append_after._id},
                    {'$set': {'next_id': first_child['_id']}},
                )
            else:
                last_child['next_id'] = orig_first_child_id
                objects.find_one_and_update(
                    {'_id': self._id},
                    {'$set': {'first_child_id': first_child['_id']}},
                )


            try:
                return objects.insert_many(objs)
            except BulkWriteError as e:
                # rollback
                if orig_first_child_id:
                    objects.delete_many({
                        '$or': [
                            {'ancestors': {'$in': children_ids}},
                            {'_id': {'$in': children_ids}},
                        ]
                    })
                else:
                    objects.delete_many({'ancestors': self._id})
                raise e


