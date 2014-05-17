define([
  'underscore', 'jquery', 'models', 'env', 'jquery.cookie'
], function(_, $, models, env){
  var User = models.User;
  
  var AuthUser = User.extend({
    rest: 'auth',
    initialize: function() {
      var user = this._user = new User();
      this.on('change:id', _.bind(function() {
        user.set(this.toJSON());
        this.trigger('login', this);
      }, this));
    },
    url: function() {
      return _.result(this, 'urlRoot');
    },
    isLogin: function() {
      return !!this.id;
    },
    login: function(args) {
      return this.fetch(args).always(function() {
        var csrftoken = $.cookie('csrftoken');
        $.ajaxSetup({
          crossDomain: false,
          beforeSend: function(xhr, settings) {
            // these HTTP methods do not require CSRF protection
            if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type))) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
          },
          dataType: 'json'
        });
      });
    },
    logout: function() {
      var self = this;
      $.get(env.logoutURL).done(function(){
        self.trigger('logout');
        window.location.reload();
      });
    },
    getUser: function() {
      return this._user;
    }
  });

  return (new AuthUser());
});


