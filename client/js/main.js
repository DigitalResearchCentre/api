require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery',
    jqueryui: '../bower_components/jquery-ui/ui/jquery-ui',
    underscore: '../bower_components/underscore/underscore',
    backbone: '../bower_components/backbone/backbone',
    text: '../bower_components/requirejs-text/text',
    async: '../bower_components/requirejs-plugins/src/async',
    json: '../bower_components/requirejs-plugins/src/json',
    urijs: '../bower_components/uri.js/src'
  },
  shim: {
    jqueryui: ['jquery'],
    underscore: {exports: '_'},
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    }
  }
  , urlArgs: 'bust=' + (new Date).getTime()
});

require([
  'jquery', 'underscore', 'backbone', 'uri'
], function($, _, Backbone, URI) {

  var Model = Backbone.Model.extend({
    urlRoot: function() {
      var rest = _.result(this, 'rest');
      if (!_.isUndefined(rest)) {
        return URI.get(rest);
      } 
    }
  });

  var Collection = Backbone.Collection.extend({
    url: function() {
      console.log(URI.get(_.result(this, 'rest')))
      var uri = new URI(URI.get(_.result(this, 'rest')));
      return uri.addSearch('page_size', '0').toString();
    }
  });

  var Community = Model.extend({
    rest: 'community',
    getDocs: function() {
      if (!this._docs) {
        this._docs = new DocList([], {rest: ['community:docs', this.id]});
      }
      return this._docs;
    }
  });

  var CommunityList = Collection.extend({
    model: Community,
    rest: 'community'
  });

  var Doc = Model.extend({
    rest: 'doc'
  })

  var DocList = Collection.extend({
    rest: 'doc'
  });

  var DocView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#doc-tmpl').html()),
    render: function() {
      console.log(this.model)
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var CommunityView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#community-tmpl').html()),
    events: {
      'click': 'open',
    },
    initialize: function() {
      this.listenTo(this.model.getDocs(), 'add', this.onDocAdd);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.model.getDocs().each(this.onDocAdd, this);
      return this;
    },
    onDocAdd: function(model) {
      var view = new DocView({model: model});
      this.$el.append(view.render().$el);
    },
    open: function() {
      this.model.getDocs().fetch();
    }
  });



  var AppView = Backbone.View.extend({
    el: $('#app'),
    initialize: function() {
      this.listenTo(this.collection, 'add', this.onCommunityAdd);
    },
    onCommunityAdd: function(model) {
      var view = new CommunityView({model: model});
      this.$el.append(view.render().$el);
    }
  });
  var communityList = new CommunityList;
  var appView = new AppView({collection: communityList})
  communityList.fetch();
});


