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
  var Community = models.Community;

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
    el: $('#modal'),
    render: function() {
      var $footer = this.$('.modal-footer').empty();
      this.$('.modal-body').html(this.bodyTemplate());
      _.each(this.buttons, function(btn) {
        $footer.append($('<button/>').addClass('btn '+btn.cls)
                       .text(btn.text).click(_.bind(this[btn.event], this)));
      }, this);
      return this;
    },
    onClose: function() {
      this.$el.modal('hide');
    } 
  });

  var CreateCommunityView = ModalView.extend({
    bodyTemplate: _.template($('#community-form-tmpl').html()),
    buttons: [
      {cls: "btn-default", text: 'Close', event: 'onClose'},
      {cls: "btn-primary", text: 'Create', event: 'onCreate'},
    ],
    onCreate: function() {
      var data = {};
      _.each(['name', 'abbr'], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      return this.model.save(data).done(_.bind(function() {
        this.$('.error').addClass('hide');
        auth.getUser().getMemberships().fetch();
        (new EditCommunityView({model: this.model})).render();
      }, this)).fail(_.bind(function(resp) {
        this.$('.error').removeClass('hide').html(resp.responseText);
      }, this));
    }
  });

  var EditCommunityView = ModalView.extend({
    bodyTemplate: function() {
      return _.template($('#community-edit-tmpl').html())(this.model.toJSON());
    },
    buttons: [
      {cls: "btn-default", text: 'Close', event: 'onClose'},
      {cls: "btn-primary", text: 'Update', event: 'onUpdate'},
    ],
    onUpdate: function() {
      var data = {};
      _.each(['name', 'abbr'], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      return this.model.save(data);
    }
  });

  var MembershipRowView = Backbone.View.extend({
    tagName: 'tr',
    events: {
      'click .admin': 'onAdminClick'
    },
    template: _.template($('#membership-row-tmpl').html()),
    onAdminClick: function() {
      var community = new Community(this.model.get('community'));
      console.log(community);
      (new EditCommunityView({model: community})).render();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });


  var ProfileView = Backbone.View.extend({
    el: '#app',
    events: {
      'click .create-community-btn': 'onCreateCommunity'
    },
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
    onCreateCommunity: function() {
      (new CreateCommunityView({model: new Community()})).render();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.memberships.each(this.onMembershipAdd, this);
      return this;
    }
  });

  if (!auth.isLogin()) auth.login();
  auth.on('login', function() {
    var app = new ProfileView({model: auth.getUser()});
    app.render();
  })
});


