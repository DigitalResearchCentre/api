
require('./app.less');

var angular = require('angular');

require('angular-resource');

var services = angular.module('services', ['ngResource']);

var action = {
  patch: {
    method: 'PATCH',
  },
  update: {
    method: 'PUT',
  },
};

var CommunityFactory = function($resource) {
  var Community = $resource('/communities/:_id', {}, action);
  Community.prototype.toJson = function() {
    return JSON.stringify(this, null, 2);
  };
  return Community;
};
CommunityFactory.$inject = ['$resource'];
services.factory('Community', CommunityFactory);

var UserFactory = function($resource) {
  var User = $resource('/users/:_id', {}, action);
  User.prototype.toJson = function() {
    return JSON.stringify(this, null, 2);
  };
  return User;
};
UserFactory.$inject = ['$resource'];
services.factory('User', UserFactory);



var ctrls = angular.module('ctrls', []);

var FooCtrl = function($rootScope, Community, User) {
  this.options = [{
    name: 'Community', Resource: Community,
  }, {
    name: 'User', Resource: User,
  }];
  this.option = this.options[0];
  this.update();
};


FooCtrl.prototype.submit = function() {
  var self = this
    , object = this.object
    , data = JSON.parse(this.input)
  ;
  angular.forEach(data, function(v, k) {
    object[k] = v;
  });
  if (object._id) {
    window.oo = object;
    object.$patch({_id: object._id}, function() {
      
    }, function() {
      
    });
  } else {
    object.$save(function(obj) {
      self.objects.push(obj);
    });
  }
};
FooCtrl.prototype.update = function() {
  var Resource = this.option.Resource;
  this.objects = Resource.query();
  this.object = new Resource();
};

FooCtrl.$inject = ['$rootScope', 'Community', 'User'];

ctrls.controller('FooCtrl', FooCtrl);

var app = angular.module('app', [
  ctrls.name,
  services.name,
]);


