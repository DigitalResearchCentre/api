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
      'click .btn.admin': 'onAdminClick',
      'click .link.community': 'onCommunityLinkClick'
    },
    template: _.template($('#membership-row-tmpl').html()),
    initialize: function() {
        var model = this.model;
        this.community = model.getCommunity();
        this.role = model.getRole();
        this.tasks = model.getTasks();

        this.listenTo(model, 'remove', this.remove);
        this.listenTo(model, 'view:onAdminClick', this.onAdminClick);
        this.listenTo(model, 'change', this.onChange);
        this.listenTo(this.community, 'change', this.onChange);
        this.listenTo(this.role, 'change', this.onChange);
        this.listenTo(this.tasks, 'add', this.onTaskAdd);
    },
    onAdminClick: function() {
        console.log('onAdminClick');
        $('#modal').modal('show');
        router.navigate('community=' + this.model.getCommunity().id);
        if (!this._ecv) {
            var community = this.model.getCommunity();
            this._ecv = new EditCommunityView({model: community});
        }
        this._ecv.render();
    },
    onCommunityLinkClick: function(){
        var community = this.model.getCommunity();
        var url = urls.get(['community:friendly_url', {pk: community.id}]);
        $.get(url, function(friendlyURL) {
          window.parent.location = friendlyURL;
        });
    },
    onTaskAdd: function(task) {
      var status = ['assigned', 'in-progress', 'approval', 'published'];
      var $td = this.$('td.' + status[task.get('status')]);
      var $ul = $td.children('ul');
      var doc = task.getDoc();
      var $a = $('<a href="#task=' + task.id + '">'+doc.get('name')+'</a>');
      doc.getUrn().done(function(urn){
        var name = [];
        _.each(urn.split(':'), function (parts) {
          parts = parts.split('=');
          if (parts.length > 1) {
            name.push(parts[1]);
          }
        });
        $a.text(name.join(':'));
      });
      $a.click(_.bind(function () {
        this.viewTask(task);
      }, this));
      doc.fetch();
      $ul.append($('<li></li>').append($a));
      $td.children('span').text(' ' + $ul.children().length + ' tasks');
    },
    viewTask: function (task) {
      var doc = task.getDoc();
      var parent = doc.getParent();
      var url = urls.get(['community:friendly_url', {pk: this.model.get('community')}]);
      $.get(url, function(friendlyURL) {
        if (parent.isNew()) {
          parent.fetch().done(function() {
            var url = friendlyURL + '?docName=' + parent.get('name') 
            + '&pageName=' + doc.get('name');
          window.open(url, '_blank');
          });
        }else{
          var url = friendlyURL + '?docName=' + parent.get('name') 
          + '&pageName=' + doc.get('name');
          window.open(url, '_blank');
        }
      });
    },
    render: function() {
        this.$el.html(this.template());
        this.community.fetch();
        this.role.fetch();
        this.tasks.fetch();
        this.onChange();
        return this;
    },
    onChange: function () {
        var $el = this.$el,
        createDate = this.model.get('create_date'),
        roleName = this.role.get('name');
        this.$('.community').text(this.community.get('name'));
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
      'click .create-community-btn': 'onCreateCommunity',
      'click .home-btn': 'onHome'
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
    onHome: function() {
      window.location = urls.homeURL;
    },
    openCommunity: function (communityId) {
        var memberships = this.memberships;
        if (memberships.isFetched()) {
            console.log('openCommunity');
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
