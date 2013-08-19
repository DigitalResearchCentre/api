require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery',
    jqueryui: '../bower_components/jquery-ui/ui/jquery-ui',
    underscore: '../bower_components/underscore/underscore',
    backbone: '../bower_components/backbone/backbone',
    text: '../bower_components/requirejs-text/text',
    async: '../bower_components/requirejs-plugins/src/async',
    json: '../bower_components/requirejs-plugins/src/json',
    punycode: '../bower_components/uri.js/src/punycode',
    IPv6: '../bower_components/uri.js/src/IPv6',
    SecondLevelDomains: '../bower_components/uri.js/src/SecondLevelDomains',
    uri: '../bower_components/uri.js/src/URI'
  },
  shim: {
    jqueryui: ['jquery'],
    underscore: {exports: '_'},
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    uri: {exports: 'URI'}
  }
  , urlArgs: 'bust=' + (new Date).getTime()
});

require([
  'jquery', 'underscore', 'backbone', 'uri'
], function($, _, Backbone, URI) {
  var settings = {
    restUrl: function(url) {
      var uri = new URI('http://localhost:8000' + url);
      var url = uri.normalize().addSearch('page_size', '0').toString();
      return url;
    }
  }

  var Model = Backbone.Model.extend({
    urlRoot: function() {
      var restUrl = _.result(this, 'restUrl');
      if (!_.isUndefined(restUrl)) {
        return settings.restUrl(restUrl);
      } 
    }
  });

  var Collection = Backbone.Collection.extend({
    url: function() {
      var restUrl = _.result(this, 'restUrl');
      if (!_.isUndefined(restUrl)) {
        return settings.restUrl(restUrl);
      } 
    }
  });

  var Community = Model.extend({
    restUrl: '/communities'
  });

  var CommunityList = Collection.extend({
    model: Community,
    restUrl: '/communities'
  });

  var CommunityView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#community-tmpl').html()),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var AppView = Backbone.View.extend({
    el: $('#app'),
    initialize: function() {
      this.listenTo(this.collection, 'add', this.addCommunity);
    },
    addCommunity: function(model) {
      var view = new CommunityView({model: model});
      this.$el.append(view.render().el);
    }
  });
  var communityList = new CommunityList;
  var appView = new AppView({collection: communityList})
  communityList.fetch();
});


