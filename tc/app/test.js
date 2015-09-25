var mongoose = require('mongoose')
  , Promise = mongoose.Promise
  , models = require('./models')
  , _ = require('lodash')
  , Schema = mongoose.Schema
  , Community = models.Community
  , User = models.User
  , Doc = models.Doc
  , Revision = models.Revision
;

function init(req, res, next) {
    var c = new Community({name: 'c1'}).save();
    var d1 = new Doc({name: 'd1'}).save();
    var d11 = new Doc({name: 'd11'}).save();
    var d12 = new Doc({name: 'd12'}).save();
    var d2 = new Doc({name: 'd2'}).save();
    var d21 = new Doc({name: 'd21'}).save();
    var d22 = new Doc({name: 'd22'}).save();
    var u = new User({username: 'test'}).save();

    return _.when(c, d1, d11, d12, d2, d21, d22, u).then(
      function(c, d1, d11, d12, d2, d21, d22, u) {

      c.documents.push(d1);
      c.documents.push(d2);
      u.memberships.push({
        community: c,
        role: 'leader',
      });
      d1.children.push(d11);
      d11.ancestors.push(d1);
      d1.children.push(d12);
      d12.ancestors.push(d1);
      d2.children.push(d21);
      d21.ancestors.push(d1);
      d2.children.push(d22);
      d22.ancestors.push(d1);

      _.when(
        c.save(), u.save(), d1.save(), d2.save(),
        d11.save(), d12.save(), d21.save(), d22.save()
      ).then(function() {
        var r1 = new Revision({
          doc: d11,
          text: '<text>this is a test</text>',
        });
        r1.save(function(err) {
          d11.revisions.push(r1);
          return d11.save();
        });
        var r2 = new Revision({
          doc: d12,
          text: '<text>this is a another test</text>',
        });
        r2.save(function(err) {
          d12.revisions.push(r2);
          return d12.save();
        });


        res.json([c, d1, d2, u]);
        next();
      });
    });
}

function find() {
    var c = Community.findOne({name: 'c1'});
    var d = Doc.findOne({name: 'd1'});
    var u = User.findOne({username: 'test'});
}

function addChild() {
    var d = Doc.findOne({name: 'd1'});
    var d11 = new Doc({name: 'd11'});

    _.when(d, d11.save()).then(function(d, d11) {
      d.children.push(d11);
      d11.ancestors.push(d);
      _.when(d.save(), d11.save()).then(function(d, d11) {
        res.json([d, d11]);
      });
    });

  
}

function remove() {
  Community.remove({}, function(err, data) {
    res.json(data);
    next();
  });
}

module.exports = {
  run: function(req, res, next) {
    init(req, res, next).then(function() {
      
    }, function(err) {
      console.log(err.stack);
      next(err);
    });
  },
};
