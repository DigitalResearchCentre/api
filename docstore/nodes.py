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

def get_last_child(node):
    return collection.find_one({'parent': node['parent'], 'next': None})

def has_children(node):
    return node['first_child'] is not None

def insert_one(_id=None, parent=None, ancestors=[], 
               next=None, first_child=None, data={}):
    return collection.insert_one({
        'parent': parent, 'ancestors': ancestors, 'next': next,
        'first_child': first_child, 'data': data,
    })

def prepend(node, data):
    _id = ObjectId()
    next = node['_id']
    parent = node['parent']
    ancestors = node['ancestors']

    prev = collection.find_one_and_update(
        {'next': next},
        {'$set': {'next': _id}},
    )
    if not prev:
        collection.find_one_and_update(
            {'_id': parent},
            {'$set': {'first_child': _id}},
        )

    try:
        return insert_one(
            _id=_id, parent=parent, ancestors=ancestors,
            next=next, data=data)
    except Exception as e:
        if prev:
            collection.find_one_and_update(
                {'_id': prev['_id']},
                {'$set': {'next': next}}
            )
        else:
            collection.find_one_and_update(
                {'_id': parent},
                {'$set': {'first_child': next}},
            )
        raise e

def append(node, data):
    _id = ObjectId()
    parent = node['parent']
    ancestors = node['ancestors']
    next = node['next']
    prev = node['_id']

    collection.find_one_and_update({
        {'_id': prev},
        {'$set': {'next': _id}},
    })

    try:
        return insert_one(
            _id=_id, parent=parent, ancestors=ancestors,
            next=next, data=data)
    except Exception as e:
        collection.find_one_and_update(
            {'_id': prev},
            {'$set': {'next': next}}
        )
        raise e

def add_first_child(node, data):
    _id = ObjectId()
    parent = node['_id']
    ancestors = node['ancestors'] + [parent]
    next = node['first_child']

    collection.find_one_and_update(
        {'_id': parent},
        {'$set': {'first_child': _id}},
    )

    try:
        return insert_one(
            _id=_id, parent=parent, ancestors=ancestors,
            next=next, data=data)
    except Exception as e:
        collection.find_one_and_update(
            {'_id': parent},
            {'$set': {'first_child': next}}
        )
        raise e

def load_bulk_children(node, children_data, append_after=None):
    # children format: {
    #   data: {foo: bar}, 
    #   children: [{
    #     data: {foo: bar},
    #     children: [],
    #   }],
    # }
    parent = {
        '_id': node['_id'],
        'ancestors': node['ancestors'],
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
                'parent': parent_id,
                'next': None,
                'ancestors': ancestors,
                'children': child.get('children', []),
                'data': child.get('data', {}),
            }
            if prev:
                prev['next'] = obj['_id']
            else:
                parent['first_child'] = obj['_id']
            prev = obj
            q.append(obj)

    # pop root, since root already in database
    root = objs.pop(0)
    if objs:
        orig_first_child_id = node['first_child']
        first_child = objs[0]
        last_child = None
        # find all direct children
        children_ids = []
        for obj in objs:
            children_ids.append(obj['_id'])
            if obj['next'] is None:
                last_child = obj
                break
        if append_after:
            last_child['next'] = append_after['next']
            collection.find_one_and_update(
                {'_id': append_after['_id']},
                {'$set': {'next': first_child['_id']}},
            )
        else:
            last_child['next'] = orig_first_child_id
            collection.find_one_and_update(
                {'_id': node['_id']},
                {'$set': {'first_child': first_child['_id']}},
            )

        try:
            return collection.insert_many(objs)
        except Exception as e:
            # rollback
            if orig_first_child_id:
                collection.delete_many({
                    '$or': [
                        {'ancestors': {'$in': children_ids}},
                        {'_id': {'$in': children_ids}},
                    ]
                })
            else:
                collection.delete_many({'ancestors': node['_id']})
            raise e



