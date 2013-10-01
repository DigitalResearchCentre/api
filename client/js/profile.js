require([
  'jquery', 'underscore', 'backbone', 
  'models', 'views/createcommunity', 'views/editcommunity', 'urls', 'auth',
  'bootstrap', 'bootstrap-fileupload', 'codemirror-xml', 'jquery.cookie'
], function(
  $, _, Backbone, models, CreateCommunityView, EditCommunityView, urls, auth
) {
  var Community = models.Community;

  var MembershipRowView = Backbone.View.extend({
    tagName: 'tr',
    events: {
      'click .admin': 'onAdminClick'
    },
    template: _.template($('#membership-row-tmpl').html()),
    initialize: function() {
      this.listenTo(this.model, 'remove', this.remove);
    },
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
      if (!memberships.isFetched()) {
        memberships.fetch();
      }
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

  if (!auth.isLogin()) {
    auth.login().fail(function() {
      window.location = 'http://textualcommunities.usask.ca/drc/auth/login/' + 
        '?partner=1' + 
        '&next=http://textualcommunities.usask.ca/api/client/profile.html'
      ;
    });
  } 
  auth.on('login', function() {
    var app = new ProfileView({model: auth.getUser()});
    app.render();
  });
});

/*

Documents
  add documents
  get text from document
  delete text of document
  rename documents

 * */
