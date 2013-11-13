require([
  'jquery', 'underscore', 'backbone', 
  'models', 'views/createcommunity', 'views/editcommunity', 
  'urls', 'auth', 'router', 'vent',
  'bootstrap', 'bootstrap-fileupload', 'codemirror-xml', 'jquery.cookie'
], function(
  $, _, Backbone, models, CreateCommunityView, EditCommunityView, 
  urls, auth, router, vent
) {
  var Community = models.Community;

  var MembershipRowView = Backbone.View.extend({
    tagName: 'tr',
    events: {
      'click .admin': 'onAdminClick'
    },
    template: _.template($('#membership-row-tmpl').html()),
    initialize: function() {
        var model = this.model;

        this.community = model.getCommunity();
        this.role = model.getRole();

        this.listenTo(model, 'remove', this.remove);
        this.listenTo(model, 'view:onAdminClick', this.onAdminClick);
        this.listenTo(model, 'change', this.onChange);
        this.listenTo(this.community, 'change', this.onChange);
        this.listenTo(this.role, 'change', this.onChange);
    },
    onAdminClick: function() {
        $('#modal').modal('show');
        router.navigate('community=' + this.model.getCommunity().id);
        (new EditCommunityView({model: this.model.getCommunity()})).render();
    },
    render: function() {
        this.$el.html(this.template());
        this.community.fetch();
        this.role.fetch();
        this.onChange();
        return this;
    },
    onChange: function () {
        var $el = this.$el,
        createDate = this.model.get('create_date'),
        roleName = this.role.get('name');
        this.$('.community').text(this.community.get('name'));
        console.log(roleName);
        if (roleName === 'Leader' || roleName === 'Co Leader') {
            this.$('.btn.admin').removeClass('hide').show();
        }
        if (createDate) {
            roleName += ' since ' + createDate;
        }
        this.$('.role').text(roleName);
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
      this.listenTo(vent, 'profile:openCommunity', this.openCommunity);
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
    openCommunity: function (communityId) {
        var memberships = this.memberships;
        if (memberships.isFetched()) {
            memberships.find(function (membership) {
                if (membership.getCommunity().id === parseInt(communityId, 10)){
                    membership.trigger('view:onAdminClick');
                    return true;
                }
            });
        }else{
            this.listenToOnce(memberships, 'fetched',
                              _.bind(this.openCommunity, this, communityId));
        }
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.memberships.each(this.onMembershipAdd, this);
      return this;
    }
  });

  if (!auth.isLogin()) {
    auth.login().fail(function() {
        window.location = urls.loginURL;
    });
  } 
  auth.on('login', function() {
    var app = new ProfileView({model: auth.getUser()});
    app.render();
    Backbone.history.start();
    window.router = router;
  });
});

/*
Documents
  add documents
  get text from document
  delete text of document
  rename documents
 * */
