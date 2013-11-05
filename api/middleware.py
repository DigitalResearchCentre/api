from django.conf import settings
from django.db import connection
from api.models import Partner

class PartnerMiddleware(object):

    def process_request(self, request):
        partner_pk = request.GET.get('partner')
        if partner_pk:
            try:
                partner = Partner.objects.get(pk=partner_pk)
                request.session[settings.PARTNER_SESSION_KEY] = partner.pk
            except Partner.DoesNotExist, e:
                pass
        request.partner = None
        if settings.PARTNER_SESSION_KEY in request.session:
            try:
                partner_pk = request.session[settings.PARTNER_SESSION_KEY]
                request.partner = Partner.objects.get(pk=partner_pk)
            except Partner.DoesNotExist, e:
                pass


class QueryLogMiddleware(object):
    def process_response(self, request, response):
        if response.status_code == 200:
            total_time = 0

            for query in connection.queries:
                query_time = query.get('time')
                total_time += float(query_time)
                try:
                    print query_time, query.get('sql')
                except Exception, e:
                    print e

            print total_time
        return response

