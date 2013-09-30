define(['underscore', 'urijs/URI', 'urijs/URITemplate'], function(_, URI) {
//  var restBase = 'http://textualcommunities.usask.ca/api'
    //mediaURL = 'http://textualcommunities.usask.ca/media/tc/'
  var restBase = 'http://localhost:8000'
    , mediaURL = 'http://localhost:8000'
    , patterns = {
    'auth': '/auth/',
    'community': '/communities/',
    'community:docs': '/communities/{pk}/docs/',
    'community:refsdecls': '/communities/{pk}/get_refsdecls/',
    'community:memberships': '/communities/{pk}/memberships/',
    'community:js': '/communities/{pk}/js/',
    'community:css': '/communities/{pk}/css/',
    'community:dtd': '/communities/{pk}/schema/',
    'community:upload-tei': '/communities/{community}/upload_tei/',
    'community:upload-js': '/communities/{community}/js/',
    'community:upload-css': '/communities/{community}/css/',
    'community:upload-dtd': '/communities/{community}/schema/',
    'user': '/users/',
    'user:communities': '/users/{pk}/communities/',
    'user:memberships': '/users/{pk}/memberships/',
    'doc': '/docs/',
    'doc:xml': '/docs/{pk}/xml/',
    'doc:text': '/docs/{pk}/has_text_in/',
    'doc:upload-image-zip': '/docs/{pk}/upload_zip/',
    'text': '/texts/',
    'refsdecl': '/refsdecl/',
    'js': '/js/',
    'css': '/css/',
    'schema': '/schema/'
  };

  return {
    mediaURL: mediaURL,
    get: function(name, search) {
      var uri = new URI(restBase)
        , kwargs = {}
        , path
      ;
      if (!search) {
        search = {};
      }
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
