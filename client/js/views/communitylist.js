define([
  'backbone', 'models', 'authuser', 'text!tmpl/communitylist.html'
], function(Backbone, models, authuser, tmpl) {
  var Community = models.Community;

  var CommunityListView = Backbone.View.extend({
    template: _.template(tmpl),
    initialize: function() {
      var communities = Community.objects;
      this.listenTo(authuser, 'login', this.onLogin);
      this.listenTo(authuser, 'logout', this.onLogout);
      this.listenTo(communities, 'add', this.onPublicCommunityAdd);
      if (!communities.isFetched()) communities.fetch();
    },
    onLogin: function() {
      this.listenTo(authuser.getCommunities(), 'add', this.onMyCommunityAdd);
      this.renderMy();
      this.$('.login-required').show();
      this.$('.nav-tabs li:visible:first a').tab('show');
    },
    onLogout: function() {
      this.$('.login-required').hide();
      this.$('.nav-tabs li:visible:first a').tab('show');
    },
    onCommunityAdd: function($ul, community) {
      $ul.append($('<li/>').text(community.get('name')));
    },
    onPublicCommunityAdd: function(community) {
      this.onCommunityAdd(this.$('#public-communities'), community);
    },
    onMyCommunityAdd: function(community) {
      this.onCommunityAdd(this.$('#my-communities'), community);
    },
    renderPublic: function() {
      this.$('#public-communities').empty();
      Community.objects.each(this.onPublicCommunityAdd, this);
    },
    renderMy: function() {
      this.$('#my-communities').empty();
      authuser.getCommunities().each(this.onMyCommunityAdd, this);
    },
    render: function() {
      this.$el.html(this.template());
      if (authuser.isLogin()) {
        this.onLogin();
      }else{
        this.onLogout();
      }
      this.renderPublic();
      return this;
    }
  })

  return CommunityListView;
});
