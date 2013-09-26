define([
  'underscore', 'jquery', 'models', 'jquery.cookie'
], function(_, $, models){
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
      return this.fetch(args).done(function() {
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
    getUser: function() {
      return this._user;
    }
  });

  return (new AuthUser());
});

