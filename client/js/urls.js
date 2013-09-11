define(['underscore', 'urijs/URI', 'urijs/URITemplate'], function(_, URI) {
//  var restBase = 'http://textualcommunities.usask.ca/api'
  var restBase = 'http://localhost:8000'
    , patterns = {
    'auth': '/auth/',
    'community': '/communities/',
    'community:docs': '/communities/{pk}/docs/',
    'community:refsdecls': '/communities/{pk}/get_refsdecls/',
    'user': '/users/',
    'user:communities': '/users/{pk}/communities/',
    'user:memberships': '/users/{pk}/memberships/',
    'doc': '/docs/',
    'refsdecl': '/refsdecl/'
  };

  return {
    get: function(name, search) {
      var uri = new URI(restBase)
        , kwargs = {}
        , path
      ;
      search || (search = {});
      if (_.isArray(name)) {
        kwargs = name[1];
        name = name[0];
      }
      if (!patterns[name]) {
        throw Error('undefined url pattern: ' + name);
      }
      path = URI.expand(patterns[name], kwargs);
      return uri.segment(path).addSearch(search).normalize().toString();
    },
    URI: URI
  };
});
