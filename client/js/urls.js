define(['underscore', 'urijs/URI', 'urijs/URITemplate'], function(_, URI) {
  var restBase = 'http://textualcommunities.usask.ca/api'
    , patterns = {
    'community': '/communities/',
    'community:docs': '/communities/{pk}/docs/',
    'community:refsdecls': '/communities/{pk}/get_refsdecls/',
    'doc': '/docs/',
    'refsdecl': '/refsdecl/'
  };

  URI.get = function(name, search) {
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
    return uri.path(path).addSearch(search).toString();
  }

  return URI;
});
