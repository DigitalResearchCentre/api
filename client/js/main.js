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
    template: _.template($('#community-info-tmpl').html()),
    initialize: function() {
      var communities = new (Collection.extend({
        model: Community, rest: 'community'
      }))();
      this.listenTo(auth, 'login', this.onLogin);
      auth.login();
      communities.fetch(); 
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      (new CommunityListView({el: this.$('.community-list')})).render();
      return this;
    }
  });

  var uri = new urls.URI()
    , community = new Community({id: uri.query(true).community})
  ;

  community.fetch().done(function() {
    var app = new AppView({model: community});
    app.render();
  }).fail(function(resp) {
    alert(resp.responseText);
  });
});


