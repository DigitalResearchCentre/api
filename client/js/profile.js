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
    'bootstrap-fileupload': 
      '../lib/bootstrap-jasny/docs/assets/js/bootstrap-fileupload',
    codemirror: '../lib/codemirror/lib/codemirror',
    'jquery.cookie': '../lib/jquery.cookie/jquery.cookie',
    'codemirror-xml': '../lib/codemirror/mode/xml/xml',
    tmpl: '../tmpl'
  },
  shim: {
    bootstrap: ['jquery'],
    'bootstrap-fileupload': ['bootstrap'],
    'jquery.cookie': ['jquery'],
    codemirror: {exports: 'CodeMirror'},
    'codemirror-xml': ['codemirror']
  }
  , urlArgs: 'bust=' + (new Date).getTime()
});

require([
  'jquery', 'underscore', 'backbone', 
  'models', 'views/fileupload', 'views/editcommunity', 'urls', 'auth',
  'bootstrap', 'bootstrap-fileupload', 'codemirror-xml', 'jquery.cookie'
], function(
  $, _, Backbone, models, FileUploadView, EditCommunityView, urls, auth
) {
  var Community = models.Community;

  var TEIUploadView = FileUploadView.extend({
    getTmplData: function() {
      return {name: 'xml'};
    },
    getFormData: function() {
      var $form = this.$('form.fileupload');
      return new FormData($form[0]);
    },
    getUrl: function() {
      return urls.get(['community:upload-tei', {community: this.model.id}]);
    }
  });

  var JSUploadView = FileUploadView.extend({
    getTmplData: function() {
      return {name: 'js'};
    },
    getFormData: function() {
      var $form = this.$('form.fileupload');
      return new FormData($form[0]);
    },
    getUrl: function() {
      return urls.get(['community:upload-js', {community: this.model.id}]);
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

  auth.isLogin() || auth.login().fail(function() {
    //window.location = 'http://textualcommunities.usask.ca/drc/auth/login/?next=http://textualcommunities.usask.ca/api/client/profile.html';
  });
  auth.on('login', function() {
    var app = new ProfileView({model: auth.getUser()});
    app.render();
  })
});

/*

Documents
  add documents
  get text from document
  delete text of document
  rename documents

 * */
