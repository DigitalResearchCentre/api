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
        this.tasks = this.model.getTasks();
        this.listenTo(this.tasks, 'add', this.onTaskAdd);

        this.listenTo(model, 'remove', this.remove);
        this.listenTo(model, 'view:onAdminClick', this.onAdminClick);
        this.listenTo(model, 'change', this.onChange);
        this.listenTo(this.community, 'change', this.onChange);
        this.listenTo(this.role, 'change', this.onChange);
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
        window.location = urls.restBase + 'interface/indexajax.html?community=' + community.get('abbr');
        return;
        var url = urls.get(['community:friendly_url', {pk: community.id}]);
        $.get(url, function(friendlyURL) {
          window.parent.location = friendlyURL + '/viewer';
        });
    },
    render: function() {
        this.$el.html(this.template());
        this.community.fetch();
        this.role.fetch();
        this.tasks.each(this.onTaskAdd, this);
        this.tasks.fetch();
        this.$('td>ul').addClass('folder folder-close');
        this.$('td>span').
          addClass('btn glyphicon glyphicon-folder-close').
          click(_.bind(this.onToggleClick, this));

        this.onChange();
        return this;
    },
    onToggleClick: function (event){
      var $el = $(event.target);
      $el.toggleClass('glyphicon-folder-close glyphicon-folder-open');
      $el.siblings('ul').toggleClass('folder-open folder-close');
    },
    onTaskAdd: function (task) {
      var cls, $td, $ul, $a,
      doc = task.getDoc(),
      status = task.status;

      switch (task.get('status')) {
        case status.ASSIGNED:
          cls = 'assigned';
          break;
        case status.IN_PROGRESS:
          cls = 'in-progress';
          break;
        case status.SUBMITTED:
          cls = 'submitted';
          break;
        case status.COMPLETED:
          cls = 'completed';
          break;
        default:
          return;
      }
      $td = this.$('.' + cls);
      $ul = $td.children('ul');
      $a = $('<a href="#task=' + task.id + '">'+doc.get('name')+'</a>');
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
        this.options.viewTask(task);
      }, this));
      this.listenTo(doc, 'change', function () {
        $a.text(doc.get('name'));
      });
      doc.fetch();
      $ul.append($('<li></li>').append($a));
      $td.children('span').text(' ' + $ul.children().length + ' tasks');
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
      'click .home-link': 'onHomeLinkClick',
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
    onHomeLinkClick: function(){
      window.location = urls.homeURL;
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
        window.location = urls.homeURL; 
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
