var _ = require('lodash')
  , mongoose = require('mongoose')
  , Promise = mongoose.Promise
;

_.mixin({
  when: function() {
    var promise = new Promise()
      , resolves = _.toArray(arguments)
      , length = resolves.length
      , resolved = new Array(length) 
    ;
    var successFunc = function(i) {
      return function(data) {
        resolved[i] = arguments.length > 1 ? _.toArray(arguments) : data;
        length -= 1;
        if (length === 0) {
          promise.fulfill.apply(promise, resolved);
        }
      };
    };

    _.each(resolves, function(resolve, i) {
      if (_.isFunction(resolve.then)) {
        resolve
          .onFulfill(successFunc(i))
          .onReject(promise.reject.bind(promise))
        ;
      } else {
        resolved[i] = resolve;
        length -= 1;
      }
    });

    if (length === 0) {
      promise.fulfill.apply(promise, resolved);
    }
    return promise;
  },
});

var restify = require('restify')
  , redirect = require('restify-redirect')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , bunyan = require('bunyan') 
  , sessions = require("client-sessions")
  , config = require('./config')
  , User = require('./models').User 
  , serverName = 'textual communities'
  , log, logger, server
;



log = new bunyan.createLogger({
  name: serverName,
});

server = restify.createServer({
  name: serverName,
  log: log,
});
server.use(redirect());
server.use(restify.requestLogger());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser({
  mapParams: false,
}));
server.use(restify.conditionalRequest());
server.use(sessions({
  cookieName: 'session',
  secret: 'secret hello world',
  duration: 30 * 24 * 60 * 60 * 1000,
}));
server.use(passport.initialize());
server.use(passport.session());
server.pre(restify.pre.sanitizePath());

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({username: username}, function(err, user) {
    if (err) {
      done(null, false, {error: 'Incorrect username or password'});
    }
    done(null, user);
  });
}));
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


mongoose.connect(config.database.uri);

require('./routes')(server);

server.on('uncaughtException', function(req, res, route, err) {
  console.log(err.stack);
  res.send(err);
});
process.on('uncaughtException', function(err) {
  console.log(err.stack);
});

server.listen(config.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;


