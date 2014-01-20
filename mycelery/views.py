import json
from django.http import HttpResponse

from celery import states
from celery.result import AsyncResult
from celery.utils import get_full_cls_name
from celery.utils.encoding import safe_repr

def task_status(request, task_id):
    """Returns task status and result in JSON format."""
    result = AsyncResult(task_id)
    state, retval = result.state, result.result
    response_data = {'id': task_id, 'status': state, 'result': retval}
    if state in states.EXCEPTION_STATES:
        traceback = result.traceback
        response_data.update({'result': safe_repr(retval),
                              'exc': get_full_cls_name(retval.__class__),
                              'traceback': traceback})
    return HttpResponse(json.dumps({'task': response_data}),
                        content_type='application/json',)


