var assert = require('assert')
  , restify = require('restify')
;

process.env.TC_ENV = 'test';

describe('TC tests', function() {
  var server = require('../app/app')
    , config = require('../app/config')
    , models = require('../app/models')
    , Community = models.Community
    , client, fixtures
  ;

  before(function(done) {
    client = restify.createJsonClient({
      version: '*',
      url: 'http://localhost:' + config.port,
    });

    fixtures = require('pow-mongodb-fixtures').connect(config.database.name);
    fixtures.clearAllAndLoad({}, function(err) {
      done();
    });
  });

  after(function() {
    server.close();
  });


  describe('Community', function() {

    it('should create new community', function(done) {
      client.post('/communities', {
        name: 'hello'
      }, function(err, req, res, obj) {
        assert.ifError(err);
        done();
      });
    });

    it('should get a list of communities', function(done) {
      client.get('/communities', function(err, req, res, obj) {
        assert.ifError(err);
        assert.equal(obj.length, 1);
        console.log(obj);
        assert.equal(obj[0].name, 'hello');
        done();
      });
    });
  });
});
