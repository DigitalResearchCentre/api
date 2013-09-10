define(['underscore', 'models'], function(_, models){
  
  var AuthUser = models.User.extend({
    rest: 'auth',
    initialize: function() {
      this.on('change:id', _.bind(function() {
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
    }
  });

  return (new AuthUser);
});
