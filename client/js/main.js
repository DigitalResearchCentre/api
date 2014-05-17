require([
  'jquery', 'underscore', 'backbone',
  'models', 'views/communitylist', 'urls', 'auth', 'env',
  'bootstrap', 'codemirror-xml'
], function(
  $, _, Backbone, models, CommunityListView, urls, auth, env
) {
  var Community = models.Community
    , Collection = models.Collection
  ;

  var AppView = Backbone.View.extend({
    el: '#app',
    events: {
      'click button.signin': 'onSigninClick',
      'click button.signout': 'onSignoutClick',
      'click button.profile': 'onProfileClick',
    },
    template: _.template($('#community-info-tmpl').html()),
    initialize: function() {
      var communities = new (Collection.extend({
        model: Community, rest: 'community'
      }))();
      this.listenTo(auth, 'login', this.onLogin);
      this.listenTo(auth, 'logout', this.onLogin);
      auth.login();
      communities.fetch(); 
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      (new CommunityListView({el: this.$('.community-list')})).render();
      return this;
    },
    onSigninClick: function() {
      $('.signin-error').addClass('hide');
      $.post(env.loginURL, {
        username: $('#username').val(),
        password: $('#password').val(),
      }).done(function(){
        auth.login();
        $('#signin-modal').modal('hide')
      }).fail(function(){
        $('.signin-error').removeClass('hide');
      });
    },
    onLogin: function() {
      var first = auth.get('first_name');
      var last = auth.get('last_name');
      var name = first || last ? first + ' ' + last : auth.get('email');
      $('.profile').text(name);
      $('.signin').addClass('hide');
      $('.signout').removeClass('hide');
    },
    onLogout: function() {
      $('.signin').removeClass('hide');
      $('.signout').addClass('hide');
    },
    onSignoutClick: function(){
      auth.logout();
    },
    onProfileClick: function() {
      window.location = env.clientBase + 'profile.html';
    }
  });

  var uri = new urls.URI()
    , community = new Community({id: uri.query(true).community || 1})
  ;

  community.fetch().done(function() {
    var app = new AppView({model: community});
    app.render();
  }).fail(function(resp) {
    alert(resp.responseText);
  });
});


