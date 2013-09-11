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
  'models', 'views/communitylist', 'urls', 'auth',
  'bootstrap', 'codemirror-xml'
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
  })

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


