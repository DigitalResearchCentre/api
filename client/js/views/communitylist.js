define([
  'backbone', 'models', 'auth', 'urls', 'text!tmpl/communitylist.html'
], function(Backbone, models, auth, urls, tmpl) {
  var Community = models.Community;

  var CommunityListView = Backbone.View.extend({
    template: _.template(tmpl),
    initialize: function() {
      var communities = Community.objects;
      this.listenTo(auth, 'login', this.onLogin);
      this.listenTo(auth, 'logout', this.onLogout);
      this.listenTo(communities, 'add', this.onPublicCommunityAdd);
      if (!communities.isFetched()) {
        communities.fetch();
      }
    },
    onLogin: function() {
      var myCommunities = this.myCommunities = auth.getUser().getCommunities();
      this.listenTo(this.myCommunities, 'add', this.onMyCommunityAdd);
      if (!myCommunities.isFetched()) {
        myCommunities.fetch();
      }
      this.renderMy();
      this.$('.login-required').show();
      this.$('.nav-tabs li:visible:first a').tab('show');
    },
    onLogout: function() {
      this.$('.login-required').hide();
      this.$('.nav-tabs li:visible:first a').tab('show');
    },
    onCommunityAdd: function($ul, community) {
      var $a = $('<a href="#"/>').text(community.get('name'));
      $a.click(_.bind(function() {
        var url = urls.get(['community:friendly_url', {pk: community.id}]);
        $.get(url, function(friendlyURL) {
          window.parent.location = friendlyURL;
        });
      }, this));
      $ul.append($('<li/>').append($a));
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
      _.each(this.myCommunities, this.onMyCommunityAdd, this);
    },
    render: function() {
      this.$el.html(this.template());
      if (auth.isLogin()) {
        this.onLogin();
      }else{
        this.onLogout();
      }
      this.renderPublic();
      return this;
    }
  });

  return CommunityListView;
});
