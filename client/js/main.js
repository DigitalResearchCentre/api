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
  'jquery', 'underscore', 'backbone', 'models'
], function($, _, Backbone, models) {
  var Community = models.Community;

  /*
  var data = {
    name: 'test community', abbr: 't1', long_name: '',
    font: '', description: ''
  }
  var community = new Community(data);
  community.save();
  community.destroy();
  */

  var community = new Community({id: 1})
  var refsdecls = community.getRefsdecls();
  console.log(refsdecls)
  refsdecls.fetch();
  console.log(refsdecls);

  /*
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
  */
});


