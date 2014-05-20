mysql.server start 
rabbitmq-server &
celery worker --app=mycelery -l info &
python manage.py runserver &


