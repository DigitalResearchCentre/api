from django.db import connection

class QueryLogMiddleware(object):
    def process_response(self, request, response):
        if response.status_code == 200:
            total_time = 0

            for query in connection.queries:
                query_time = query.get('time')
                total_time += float(query_time)
                try:
                    # print query_time, query.get('sql')
                    pass
                except Exception, e:
                    print e

            # print total_time
        return response

