require([
  'jquery', 'underscore', 'backbone',
  'models', 'views/communitylist', 'urls', 'auth',
  'bootstrap', 'codemirror-xml'
], function(
  $, _, Backbone, models, CommunityListView, urls, auth
) {
  var Community = models.Community
    , Collection = models.Collection
  ;

  var AppView = Backbone.View.extend({
    el: '#app',
    events: {
      'click .btn.sign-in-btn': 'onSignInClick',
      'click .btn.profile-btn': 'onProfileClick',
    },
    template: _.template($('#community-info-tmpl').html()),
    initialize: function() {
      var communities = new (Collection.extend({
        model: Community, rest: 'community'
      }))();
      this.listenTo(auth, 'login', this.onLogin, this);
      this.listenTo(auth, 'logout', this.onLogout, this);
      auth.login();
      communities.fetch(); 
    },
    onSignInClick: function() {
      window.location = urls.loginURL;
    },
    onProfileClick: function() {
      window.location = urls.profileURL;
    },
    onLogin: function() {
      this.$el.find('.sign-in-btn').hide();
      this.$el.find('.profile-btn').removeClass('hide');
    },
    onLogout: function() {
      this.$el.find('.profile-btn').addClass('hide');
      this.$el.find('.sign-in-btn').show();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      (new CommunityListView({el: this.$('.community-list')})).render();
      return this;
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


