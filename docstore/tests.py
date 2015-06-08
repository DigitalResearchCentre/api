from bson.objectid import ObjectId

from django.test import TestCase

from docstore import nodes



class RevisionTestCase(TestCase):
    def setUp(self):
        self.collection = nodes.collection

    def tearDown(self):
        self.collection.remove()

    def assertNode(self, obj, parent=None, ancestors=[], 
                   next=None, first_child=None, data={}):
        self.assertEqual(obj['parent'], parent)
        self.assertEqual(obj['ancestors'], ancestors)
        self.assertEqual(obj['first_child'], first_child)
        self.assertEqual(obj['next'], next)
        self.assertEqual(obj['data'], data)
        self.assertTrue(isinstance(obj['_id'], ObjectId))

    def get_test_tree_node_ids(self):
        if not hasattr(self, '_test_tree_node_ids'):
            result = nodes.insert_one(data={'test': 'test_tree root'})
            root = nodes.get_node(result.inserted_id)
            r = nodes.add_first_child(root, {
                'test': 'test_tree child_2'
            })
            child_2 = nodes.get_node(r.inserted_id)
            r = nodes.add_first_child(child_2, {
                'test': 'test_tree child_22'
            })
            child_22 = nodes.get_node(r.inserted_id)
            r = nodes.add_first_child(child_2, {
                'test': 'test_tree child_21'
            })
            child_21 = nodes.get_node(r.inserted_id)
            r = nodes.add_first_child(root, {
                'test': 'test_tree child_1'
            })
            child_1 = nodes.get_node(r.inserted_id)
            self._test_tree_node_ids = [
                root['_id'], child_1['_id'], child_2['_id'],
                child_21['_id'], child_22['_id'],
            ]
        return self._test_tree_node_ids

    def test_insert_one(self):
        result = nodes.insert_one(data={'test': 'insert_one'})
        obj_id = result.inserted_id
        self.assertTrue(isinstance(obj_id, ObjectId))
        obj = nodes.get_node(obj_id)
        self.assertNode(obj, data={'test': 'insert_one'})

    def test_get_node(self):
        result = nodes.insert_one(data={'test': 'get_node'})
        obj = nodes.get_node(result.inserted_id)
        self.assertNode(obj, data={'test': 'get_node'})

    def test_add_first_child(self):
        result = nodes.insert_one(data={'test': 'add_first_child root'})
        root = nodes.get_node(result.inserted_id)
        r = nodes.add_first_child(root, {
            'test': 'add_first_child child'
        })
        first_child = nodes.get_node(r.inserted_id)
        root = nodes.get_node(root['_id'])
        self.assertEqual(root['first_child'], first_child['_id'])
        self.assertNode(first_child, parent=root['_id'], 
                        ancestors=[root['_id']], 
                        data={'test': 'add_first_child child'})
        r = nodes.add_first_child(root, {
            'test': 'add_first_child new_first_child'
        })
        new_first_child = nodes.get_node(r.inserted_id)
        root = nodes.get_node(root['_id'])
        self.assertNode(new_first_child, parent=root['_id'], 
                        next=first_child['_id'],
                        ancestors=[root['_id']], 
                        data={'test': 'add_first_child new_first_child'})
        self.assertNode(root, first_child=new_first_child['_id'],
                        data={'test': 'add_first_child root'})

    def test_get_tree(self):
        ids = self.get_test_tree_node_ids()
        objs = list(nodes.get_tree(ids[0]))
        ids_set = set(ids)
        ids_set.update([obj['_id'] for obj in objs])
        # test ids contains same _id in all tree elements
        self.assertEqual(len(ids_set), len(ids))

    def test_get_last_child(self):
        ids = self.get_test_tree_node_ids()
        root = nodes.get_node(ids[0])
        last_child = nodes.get_last_child(root)
        self.assertEqual(last_child['data'], {'test': 'test_tree child_2'})

    def test_has_children(self):
        ids = self.get_test_tree_node_ids()
        root = nodes.get_node(ids[0])
        self.assertEqual(nodes.has_children(root), True)

    def test_prepend(self):
        r = nodes.insert_one(data={'test': 'prepend'})
        node = nodes.get_node(r.inserted_id)
        r = nodes.prepend(node, {'test': 'prepend prev'})
        prev = nodes.get_node(r.inserted_id)
        self.assertNode(prev, next=node['_id'], data={'test': 'prepend prev'})

        r = nodes.add_first_child(node, {'test': 'prepend child'})
        child = nodes.get_node(r.inserted_id)
        r = nodes.prepend(child, {'test': 'prepend prev_child'})
        prev_child = nodes.get_node(r.inserted_id)
        self.assertNode(prev_child, next=child['_id'], parent=node['_id'], 
                        ancestors=[node['_id']], 
                        data={'test': 'prepend prev_child'})
        node = nodes.get_node(node['_id'])
        self.assertEqual(node['first_child'], prev_child['_id'])

    def test_append(self):
        r = nodes.insert_one(data={'test': 'append'})
        node = nodes.get_node(r.inserted_id)
        r = nodes.append(node, {'test': 'append after'})
        after = nodes.get_node(r.inserted_id)
        node = nodes.get_node(node['_id'])
        self.assertNode(node, next=after['_id'], data={'test': 'append'})
        self.assertNode(after, data={'test': 'append after'})

        r = nodes.add_first_child(node, {'test': 'append child'})
        child = nodes.get_node(r.inserted_id)
        r = nodes.append(child, {'test': 'append after_child'})
        after_child = nodes.get_node(r.inserted_id)
        node = nodes.get_node(node['_id'])
        self.assertNode(after_child, parent=node['_id'], 
                        ancestors=[node['_id']], 
                        data={'test': 'append after_child'})
        self.assertNode(node, first_child=child['_id'], next=after['_id'], 
                        data={'test': 'append'})

    def test_load_bulk_children(self):
        r = nodes.insert_one(data={'name': 'root'})
        root = nodes.get_node(r.inserted_id)
        result = nodes.load_bulk_children(root, [{
            'data': {'name': 'child_1'},
            'children': [
                {'data': {'name': 'child_11'}},
                {'data': {'name': 'child_12'}},
            ],
        }, {
            'data': {'name': 'child_2'},
            'children': [
                {'data': {'name': 'child_21'}},
                {
                    'data': {'name': 'child_22'},
                    'children': [
                        {'data': {'name': 'child_221'}},
                        {'data': {'name': 'child_222'}},
                    ]
                },
            ],
        }])

        objs = list(nodes.get_tree(root['_id']))
        ids_set = set(result.inserted_ids)
        ids_set.update([obj['_id'] for obj in objs])
        self.assertEqual(len(ids_set), 9)

        node_dict = {}
        for obj in objs:
            node_dict[obj['_id']] = obj
            if obj['parent'] is None:
                root = obj

        self.assertEqual(root['data']['name'], 'root')
        child_1  = node_dict[root['first_child']]
        child_2 = node_dict[child_1['next']]
        self.assertEqual(child_1['data']['name'], 'child_1')
        self.assertEqual(child_2['data']['name'], 'child_2')
        child_11 = node_dict[child_1['first_child']]
        child_12 = node_dict[child_11['next']]
        self.assertEqual(child_11['data']['name'], 'child_11')
        self.assertEqual(child_12['data']['name'], 'child_12')
        child_21 = node_dict[child_2['first_child']]
        child_22 = node_dict[child_21['next']]
        child_221 = node_dict[child_22['first_child']]
        child_222 = node_dict[child_221['next']]
        self.assertEqual(child_21['data']['name'], 'child_21')
        self.assertEqual(child_22['data']['name'], 'child_22')
        self.assertEqual(child_221['data']['name'], 'child_221')
        self.assertEqual(child_222['data']['name'], 'child_222')


