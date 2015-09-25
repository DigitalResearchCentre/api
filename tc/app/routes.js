var _ = require('lodash')
  , config = require('./config')
  , restify = require('restify')
  , passport = require('passport')
  , path = require('path')
  , test = require('./test')
  , models = require('./models')
  , Resource = require('./resource')
  , Community = models.Community
  , User = models.User
  , Doc = models.Doc
  , Revision = models.Revision
;

module.exports = function(server) {
  var UserResource = Resource(User, {
    toObject: function(data, cb) {
      return this.toObject(data, {
        transform: function(doc, ret, options) {
          delete ret.password;
        }
      }, cb);
    }
  });
  server.get('test', test.run);

  UserResource.serve('/users', server);
  Resource(Doc, {
    query: function() {
      return this.getQuery().limit(1000);
    },
  }).serve('/docs', server);
  Resource(Community).serve('/communities', server);
  Resource(Revision).serve('/revisions', server);

  server.get('/auth/', function(req, res, next) {
    if (req.isAuthenticated()) {
      req.params.id = req.user._id;
      return UserResource.detail()(req, res, next);
    } else {
      res.json({});
    }
    next();
  });
  server.post('/login/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      req.logIn(user, function(err) {
        if (err) {next(err);}
        if (req.isAuthenticated()) {
          req.session.user_id = user._id;
          req.params.id = req.user._id;
          return UserResource.detail()(req, res, next);
        }
      });
    })(req, res, next);
  });
  server.get('/logout/', function(req, res, next) {
    req.logout();
    res.json({});
  });




  if (config.DEBUG) {
    server.get('/.*/', restify.serveStatic({
      directory: path.join(__dirname, '..', 'client'),
      default: 'index.html',
    }));
  }

};


