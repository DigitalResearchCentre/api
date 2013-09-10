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
    codemirror: '../lib/codemirror/lib/codemirror',
    'codemirror-xml': '../lib/codemirror/mode/xml/xml',
    tmpl: '../tmpl'
  },
  shim: {
    bootstrap: ['jquery'],
    codemirror: {exports: 'CodeMirror'},
    'codemirror-xml': ['codemirror']
  }
  , urlArgs: 'bust=' + (new Date).getTime()
});

require([
  'jquery', 'underscore', 'backbone', 'codemirror', 
  'models', 'views/communitylist', 'urls', 'authuser',
  'bootstrap', 'codemirror-xml'
], function(
  $, _, Backbone, CodeMirror, models, CommunityListView, urls, authuser
) {
  var Community = models.Community
    , Collection = models.Collection

  var CommunityView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#community-form-tmpl').html()),
    events: {
      'click .buttons .delete': 'delete',
      'click .buttons .update': 'save'
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    },
    delete: function() {
      var dfd = this.model.destroy();
      this.remove();
      return dfd;
    },
    save: function() {
      var model = this.model;
      _.each(['name', 'abbr', 'long_name', 'font'], function(name) {
        model.set(name, this.$('input[name="'+name+'"]').val());
      }, this);
      model.set('description', this.$('textarea[name="description"]').val());
      return this.model.save();
    }
  });

  var RefsdeclView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#refsdecl-form-tmpl').html()),
    events: {
      'change select': 'selectRefsdecl',
      'click .update': 'save'
    },
    render: function() {
      var $el = this.$el
        , model = this.model
        , $select, cm
      ;
      $el.html(this.template(model.toJSON()));     
      this.codemirror = cm = CodeMirror.fromTextArea(
        this.$('.xml-editor')[0], 
        {mode: 'xml', lineWrapping: true, lineNumbers: true, autofocus: true}
      );
      cm.getDoc().setValue('<refsDecl>\n</refsDecl>');

      $select = this.$('select');
      this.collection.each(function(refsdecl) {
        $select.append(
          $('<option value="'+refsdecl.id+'">' + 
            refsdecl.get('name') + '</option>')
        )
      });
      this.selectRefsdecl();
      this.delegateEvents();
      return this;
    },
    selectRefsdecl: function() {
      var refsdeclId = this.$('select').val()
        , refsdecl = this.collection.get(refsdeclId)
      ;
      this.$('input[name="name"]').val(refsdecl.get('name'));
      this.$('textarea[name="description"]').val(refsdecl.get('description'));
      this.codemirror.getDoc().setValue(refsdecl.get('xml'));
    },
    save: function() {
      var refsdeclId = this.$('select').val()
        , refsdecl = this.collection.get(refsdeclId)
      ;
      refsdecl.set('name', this.$('input[name="name"]').val())
      refsdecl.set(
        'description', this.$('textarea[name="description"]').val()
      );
      refsdecl.set('xml', this.codemirror.getDoc().getValue());
      return refsdecl.save();
    }
  });

  var AddTextView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#add-text-tmpl').html()),
    render: function() {
      this.$el.html(this.template({communityId: this.model.id}));
      return this;
    }
  });


  var AppView = Backbone.View.extend({
    el: '#app',
    initialize: function() {
      var communities = new (Collection.extend({
          model: Community, rest: 'community'
        }))
      ;
      this.listenTo(authuser, 'login', this.onLogin);
      this.listenTo(communities, 'add', this.onCommunityAdd);
      authuser.login();
      communities.fetch(); 
    },
    render: function() {
      var clView = new CommunityListView({el: this.$('.community-list')}); 
      this.$el.append(clView.render().$el);
      return this;
      var curURL = new urls.URI()
        , id = curURL.query(true).community || 1
        , community = new Community({id: id})
        , $el = this.$el
        , refsdecls = community.getRefsdecls()
      ;
      community.fetch({success: _.bind(function(community) {
        $el.append((new CommunityView({model: community})).render().$el);
        $el.append((new AddTextView({model: community})).render().$el);

      }, this)});

      refsdecls.fetch({success: _.bind(function(collection) {
        var view = new RefsdeclView({
          model: community, collection: collection
        });
        $el.append(view.render().$el)
        view.codemirror.refresh();
      }, this)});

      return this;
    },
    onCommunityAdd: function(community) {
      this.$('.community-category')
    }
  });

  var app = new AppView();
  app.render();
});


