require.config({
  paths: {
    jquery: [
      '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
      '../lib/jquery/jquery'
    ],
    backbone: '../lib/backbone-amd/backbone',
    underscore: '../lib/underscore-amd/underscore',
    text: '../lib/requirejs-text/text',
    async: '../lib/requirejs-plugins/src/async',
    json: '../lib/requirejs-plugins/src/json',
    urijs: '../lib/uri.js/src',
    bootstrap: '../lib/bootstrap/dist/js/bootstrap',
    tmpl: '../tmpl'
  },
  shim: {
    bootstrap: ['jquery']
  }
  , urlArgs: 'bust=' + (new Date).getTime()
});

require([
  'jquery', 'underscore', 'backbone', 'models', 'bootstrap'
], function($, _, Backbone, models) {
  var Community = models.Community;

  var CommunityView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#community-form-tmpl').html()),
    events: {
      'button.delete': 'onDelete',
      'button.save': 'onSave'
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    onDelete: function() {
      var dfd = this.model.destroy();
      this.remove();
      return dfd;
    },
    onSave: function() {
      return this.model.save();
    }
  });

  var RefsdeclView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#refsdecl-form-tmpl').html()),
  });

  var AppView = Backbone.View.extend({
    el: '#app',
    initialize: function() {
      this.community = new Community({id: 1});
      this.listenTo(this.community, 'change', this.render);
      this.community.fetch();
    },
    render: function() {
      var view = new CommunityView({model: this.community});
      this.$el.html(view.render().$el);
      return this;
    }
  });





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


  var communityList = new CommunityList;
  */
  var appView = new AppView();
  
});


