from pymongo import MongoClient

from django.conf import settings

MONGO_DATABASE = settings.MONGO_DATABASE
client = MongoClient(MONGO_DATABASE['HOST'])
db = client[MONGO_DATABASE['NAME']]

