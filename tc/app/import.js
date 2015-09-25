var _ = require('lodash')
  , mongoose = require('mongoose')
  , Promise = mongoose.Promise
  , fs = require('fs')
  , models = require('./models')
  , Community = models.Community
  , Doc = models.Doc
  , Revision = models.Revision
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
        length -= 1;
      }
    });

    if (length === 0) {
      promise.fulfill(resolved);
    }
    return promise;
  },
});

var docQueue = [];


function saveChildren(children, parent) {
  if (children.length > 3000) {
    console.log(parent);
    console.log(children.length);
  }

  var children = _.map(children, function(child) {
    return saveDoc(child, parent);
  });

  _.when.apply(null, children).then(function(children) {
    parent.children = children;
    parent.save();
  });
}

function saveDoc(doc, parent) {
  if (!parent || ( parent.ancestors || []).length == 0) {
    console.log((parent ? parent.name : '') + doc.name);
  }
  var d = new Doc({
    name: doc.name,
    label: doc.label,
  });
  if (parent) {
    d.ancestors = parent.ancestors.concat([parent]);
  }

  var p = d.save();
  p.then(function(d) {
    var revisions = _.map(doc.revisions, function(r) {
      r.doc = d;
      return new Revision(r).save();
    });

    _.when.apply(null, revisions).then(function() {
      d.revisions = revisions;
      return d.save();
    });
    setImmediate(function() {
      saveChildren(doc.children, d);
    });
  });
  return p;
}


mongoose.connect('mongodb://localhost/tc');

var db = mongoose.connection;
db.once('open', function(callback) {
  fs.readFile('./dumpdocs.json', function(err, data) {
    var docs = JSON.parse(data);

    var c = new Community({name: 'c1'}).save();

    c.then(function(c) {
      console.log(docs.length);
      _.each(docs, function(doc) {
        console.log(doc);
        saveDoc(doc).then(function(d) {
          c.documents.push(d);
          c.save();
        });
      })
    });  
  });
});

process.on('uncaughtException', function(err) {
  console.log(err.stack);
});


/*
*/
