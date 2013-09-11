define(['underscore', 'models'], function(_, models){
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
      return this.fetch(args);
    },
    getUser: function() {
      return this._user;
    }
  });

  return (new AuthUser);
});
