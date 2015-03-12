define([
    'underscore', 'env', 'urijs/URI', 'urijs/URITemplate'
], function(_, env, URI) {
    var patterns = {
        'auth': '/auth/',
        'community': '/communities/',
        'community:docs': '/communities/{pk}/docs/',
        'community:refsdecls': '/communities/{pk}/get_refsdecls/',
        'community:text_refsdecls': '/communities/{pk}/get_text_refsdecls/',
        'community:memberships': '/communities/{pk}/memberships/',
        'community:friendly_url': '/communities/{pk}/friendly_url/',
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
        'membership': '/memberships/',
        'membership:tasks': '/memberships/{pk}/tasks/',
        'membership:assign': '/memberships/{pk}/assign/',
        'role': '/roles/',
        'task': '/tasks/',
        'doc': '/docs/',
        'doc:parent': '/docs/{pk}/parent/',
        'doc:xml': '/docs/{pk}/xml/',
        'doc:urn': '/docs/{pk}/get_urn/',
        'doc:text': '/docs/{pk}/has_text_in/',
        'doc:upload-image-zip': '/docs/{pk}/upload_zip/',
        'text': '/texts/',
        'text:urn': '/texts/{pk}/get_urn/',
        'refsdecl': '/refsdecl/',
        'js': '/js/',
        'css': '/css/',
        'schema': '/schema/',
        'invite': '/auth/invite/',
        'action': '/v1/action/',
    };

    return {
        mediaURL: env.mediaURL,
        loginURL: env.loginURL,
        window: window,
        get: function(name, search) {
            var uri = new URI(env.restBase)
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
