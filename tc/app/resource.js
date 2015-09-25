var _ = require('lodash')
  , restify = require('restify')
  , async = require('async')
  , Revision = require('./models').Revision
;



var Resource = function(Model, options) {
  this.Model = Model;
  this.options = _.assign({
    query: this.getQuery,
    projection: this.projection,
    toObject: this.toObject,
  }, options);
};
_.assign(Resource.prototype, {
  serve: function(path, server, options) {
    var closedPath = path[path.length - 1] === '/' ? path : path + '/';

    _.assign(this.options, options);
  
    server.get(path, this.list());
    server.get(closedPath + ':id', this.detail());
    server.post(path, _.bind(this.insert, this));
    server.del(closedPath + ':id', _.bind(this.remove, this));
    server.patch(closedPath + ':id', _.bind(this.update, this));
  },
  getQuery: function() {
    var params = this.req.params || {}
      , Model = this.Model
      , find = params.find
      , fields = params.fields
      , optFields = []
      , query
    ;
    if (_.isFunction(Model.getOptFields)) {
      optFields = Model.getOptFields();
    }
    query = Model.find(find ? JSON.parse(find) : {});
    if (fields) {
      fields = JSON.parse(fields);
      if (!_.isArray(fields)) {
        fields = [fields];
      }
      _.each(fields, function(field) {
        if (!_.isString(field) || optFields.indexOf(field) === -1) { 
          query = query.populate(field);
        }
      });
    } 
    return query;
  },
  projection: function(data, cb) {
    if (!_.isArray(data ) && !_.isObject(data)) {
      return cb(new restify.ResourceNotFoundError(
        JSON.stringify(this.req.params)));
    } 
    return cb(null, data);
  },
  toObject: function(data, option, cb) {
    var params = this.req.params || {}
      , Model = this.Model
      , fields = params.fields
      , optFields = []
      , resolves = []
      , self = this
    ;
    if (_.isFunction(option)) {
      cb = option;
      option = {};
    }
    if (_.isFunction(Model.getOptFields)) {
      optFields = Model.getOptFields();
    }
    if (fields) {
      fields = JSON.parse(fields);
      if (!_.isArray(fields)) {
        fields = [fields];
      }
      fields = _.filter(fields, function(field) {
        return _.isString(field) && (optFields.indexOf(field) !== -1);
      });
      resolves = _.map(_.isArray(data) ? data : [data], function(obj) {
        return _.when.apply(null, _.map(fields, function(field) {
          return obj['get' + field]();
        }));
      });
    } else {
      fields = [];
    }
    _.when.apply(null, resolves).then(function() {
      if (_.isArray(data)) {
        data = _.map(data, function(obj) {
          return self.transform(obj, obj.toObject(option), fields);
        });
      } else if(data){
        data = self.transform(data, data.toObject(option), fields);
      }
      cb(null, data);
    }).onReject(function(err) {
      cb(err);
    });
  },
  transform: function (data, ret, fields) {
    _.each(fields, function(field) {
      ret[field] = data[field];
    });
    return ret;
  },
  createView: function(tasks) {
    tasks = _.map(tasks, function(task) {
      return _.bind(task, this);
    }, this);
    return _.bind(function(req, res, next) {
      this.req = req;
      this.res = res;
      this.next = next;
      async.waterfall(tasks.concat([
        _.bind(function(data, cb) {
          this.options.toObject.call(this, data, cb);
        }, this),
      ]), function(err, data) {
        if (err) {
          return next(err);
        }
        res.json(data);
        return next();
      });
    }, this);
  },
  insert: function(req, res, next) {
    var model = new this.Model(req.body);
    model.save(function(err, data) {
      if (err) {
        return next(err);
      }
      res.json(data);
      return next();
    });
  },
  list: function(options) {
    options = _.assign({}, this.options, this.options.list, options);
    return this.createView([
      function(cb) {
        options.query.call(this).exec(cb);
      },
      options.projection,
    ]);
  },
  detail: function(options) {
    options = _.assign({}, this.options, this.options.detail, options);
    return this.createView([
      function(cb) {
        var query = options.query.call(this);
        query.findOne({_id: this.req.params.id}).exec(cb);
      },
      options.projection,
    ]);
  },
  remove: function(req, res, next) {
    var query = this.Model.findByIdAndRemove(req.params.id);
    query.exec(function(err, data) {
      if (err) {
        return next(err);
      }
      res.json(model);
      return next();
    });
  },
  update: function(req, res, next) {
    var body = req.body;
    if (body && body.text) {
      var query = this.Model.findOne({_id: req.params.id});
      query.exec(function(err, model) {
        if (err) {
          return next(err);
        }
        var revision = new Revision({
          doc: model._id,
          text: body.text,
        });
        revision.save(function(err) {
          model.revisions.push(revision);
          model.save(function(err, data) {
            if (err) {
              return next(err);
            }
            res.json(data);
            return next();
          });
        });
      });
    } else {
      res.json({});
      next();
    }
  }
});

module.exports = function(Model, options) {
  return new Resource(Model, options);
};
