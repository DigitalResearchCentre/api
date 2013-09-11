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
    'jquery.cookie': '../lib/jquery.cookie/jquery.cookie',
    'codemirror-xml': '../lib/codemirror/mode/xml/xml',
    tmpl: '../tmpl'
  },
  shim: {
    bootstrap: ['jquery'],
    'jquery.cookie': ['jquery'],
    codemirror: {exports: 'CodeMirror'},
    'codemirror-xml': ['codemirror']
  }
  , urlArgs: 'bust=' + (new Date).getTime()
});

require([
  'jquery', 'underscore', 'backbone', 'codemirror', 
  'models', 'views/communitylist', 'urls', 'auth',
  'bootstrap', 'codemirror-xml', 'jquery.cookie'
], function(
  $, _, Backbone, CodeMirror, models, CommunityListView, urls, auth
) {

  var MembershipRowView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#membership-row-tmpl').html()),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var CommunityForm = Backbone.View.extend({
    template: _.template($('#community-form-tmpl').html()),
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    getData: function() {
      var data = {};
      _.each(['name', 'abbr'], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      return data;
    },
    onContinue: function() {
      return this.model.save(this.getData());
    }
  });

  var DocRefForm = Backbone.View.extend({
    template: _.template($('#refsdecl-form-tmpl').html()),
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    getData: function() {
      var data = {type: 0};
      _.each(['name', 'description', 'xml'], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      return data;
    },
    onContinue: function() {
      return this.model.save(this.getData());
    }
  });

  var EntityRefForm = Backbone.View.extend({
    template: _.template($('#refsdecl-form-tmpl').html()),
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    getData: function() {
      var data = {type: 1};
      _.each(['name', 'description', 'xml', 'template'], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      return data;
    },
    onContinue: function() {
      return this.model.save(this.getData());
    }
  });

  var ModalView = Backbone.View.extend({
    el: $('#create-community-modal'),
    events: {
      'click .continue': 'onContinue'
    },
    renderForm: function() {
      _.each(this.forms, function(form) {
        form.$el.hide();
      });
      this.forms[this.cur].$el.show();
    },
    render: function() {
      this.cur = 0;
      this.forms = [
        new DocRefForm({model: new models.RefsDecl()}),
        new CommunityForm({model: new models.Community()})
        //new EntityRefForm({model: new models.RefsDecl()})
      ];
      this.$('.modal-body').empty();
      _.each(this.forms, function(form){
        this.$('.modal-body').append(form.render().$el);
      }, this);
      this.renderForm();
    },
    getCurForm: function() {
      return this.forms[this.cur];
    },
    onContinue: function() {
      var cur = this.getCurForm();
      cur.onContinue && cur.onContinue().done(_.bind(function() {
        this.cur += 1;
        if (this.cur == this.forms.length) {
          _.each(this.forms, function(form) {form.remove()});
          this.$el.modal('hide');
          this.render();
        }else{
          this.renderForm();
        }
      }, this));
    }
  });

  var ProfileView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#user-info-tmpl').html()),
    initialize: function() {
      var memberships = this.memberships = this.model.getMemberships();
      this.listenTo(memberships, 'add', this.onMembershipAdd);
      if (!memberships.isFetched()) memberships.fetch();
    },
    onMembershipAdd: function(membership) {
      var $memberships = this.$('.membership-list');
      if ($memberships.length > 0) {
        var rowView = new MembershipRowView({model: membership});
        $memberships.append(rowView.render().$el);
      }
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.memberships.each(this.onMembershipAdd, this);
      new ModalView().render();
      return this;
    }
  });

  if (!auth.isLogin()) auth.login();
  auth.on('login', function() {
    var app = new ProfileView({model: auth.getUser()});
    app.render();
  })
        $('#create-community').modal()
});


