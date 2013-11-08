define(['backbone', 'vent'], function (Backbone, vent) {

    var Router = Backbone.Router.extend({
        routes: {
            'community=:community': 'openCommunity'
        },
        openCommunity: function (community) {
            vent.trigger('profile:openCommunity', community);
        }
    });


    return new Router();
});
