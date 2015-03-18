define(['backbone', 'jquery', 'urls'], function(Backbone, $, urls) {

  var Model = Backbone.Model.extend({
    url: function() {
      var url = Backbone.Model.prototype.url.apply(this, arguments);
      return url + (url.charAt(url.length - 1 ) === '/' ? '' : '/' );
    },
    urlRoot: function() {
      return urls.get(_.result(this, 'rest'));
    }
  });

  var Collection = Backbone.Collection.extend({
    urlArgs: {page_size: 0, format: 'json'},
    url: function() {
      return urls.get(_.result(this, 'rest'), this.urlArgs);
    },
    fetch: function(opts) {
      var dfd = Backbone.Collection.prototype.fetch.apply(this, arguments);
      return dfd.done(_.bind(function() {
        this._fetched = true;
        this.trigger('fetched');
      }, this)); 
    },
    isFetched: function() {
      return !!this._fetched;
    }
  });

  var Action = Model.extend({
    rest: 'action',
  });

  var Community = Model.extend({
    rest: 'community',
    getActions: function(urlArgs) {
      if (!this._actions) {
        this._actions = new (Collection.extend({
          rest: 'action',  model: Action,
          urlArgs: _.extend(urlArgs, {community: this.id}),
          parse: function(data) {
            this.meta = data.meta;
            return data.objects;
          },
        }))();
      }
      return this._actions;
    },
    getDocs: function() {
      if (!this._docs) {
        this._docs = new (Collection.extend({
          rest: ['community:docs', {pk: this.id}], model: Doc
        }))();
      }
      return this._docs;
    },
    getEntities: function() {
      if (!this._entities) {
        this._entities = new (Collection.extend({
          rest: ['community:entities', {pk: this.id}], model: Entity
        }))();
      }
      return this._entities;
    },
    getRefsdecls: function() {
      if (!this._refsdecls) {
        this._refsdecls = new (Collection.extend({
          rest: ['community:refsdecls', {pk: this.id}], model: RefsDecl
        }))();
      }
      return this._refsdecls;
    },
    getTextRefsdecls: function() {
      if (!this._text_refsdecls) {
        this._text_refsdecls = new (Collection.extend({
          rest: ['community:text_refsdecls', {pk: this.id}], model: RefsDecl
        }))();
      }
      return this._text_refsdecls;
    },
    getMemberships: function() {
      if (!this._memberships) {
        this._memberships = new (Collection.extend({
          rest: ['community:memberships', {pk: this.id}], model: Membership
        }))();
      }
      return this._memberships;
    },
    getJS: function() {
      if (!this._js) {
        this._js = new (Collection.extend({
          rest: ['community:js', {pk: this.id}], model: JS
        }))();
      }
      return this._js;
    },
    getCSS: function() {
      if (!this._css) {
        this._css = new (Collection.extend({
          rest: ['community:css', {pk: this.id}], model: CSS
        }))();
      }
      return this._css;
    },
    getDTD: function() {
      if (!this._dtd) {
        this._dtd= new (Collection.extend({
          rest: ['community:dtd', {pk: this.id}], model: DTD
        }))();
      }
      return this._dtd;
    },
    getDefaultDTD: function() {
      if (!Community._defaultDTD) {
        Community._defaultDTD = new (Collection.extend({
          rest: ['community:dtd', {pk: 1}]
        }))();
      }
      return Community._defaultDTD;
    },
    getDefaultJS: function() {
      if (!Community._defaultJS) {
        Community._defaultJS = new (Collection.extend({
          rest: ['community:js', {pk: 1}]
        }))();
      }
      return Community._defaultJS;
    },
    getDefaultCSS: function() {
      if (!Community._defaultCSS) {
        Community._defaultCSS = new (Collection.extend({
          rest: ['community:css', {pk: 1}]
        }))();
      }
      return Community._defaultCSS;
    }
  });

  Community.objects = new (Collection.extend({
    rest: ['community'], model: Community
  }))();

  var Text = Model.extend({
    rest: 'text'
  });

  var Doc = Model.extend({
    rest: 'doc',
    getXML: function() {
      return $.get(
        urls.get(['doc:xml', {pk: this.id}], {format: 'json', page_size: 0}));
    },
    getText: function() {
      var id = this.id;
      if (!this._text) {
        this._text = new (Text.extend({url: function() {
          if (this.isNew()) {
            return urls.get(['doc:text', {pk: id}], {format: 'json'});
          }
          return Text.prototype.url.apply(this, arguments);
        }}))();
      }
      return this._text;
    },
    getParent: function() {
      var id = this.id;
      if (!this._parent) {
        this._parent = new (Doc.extend({url: function() {
          if (this.isNew()) {
            return urls.get(['doc:parent', {pk: id}], {format: 'json'});
          }
          return Doc.prototype.url.apply(this, arguments);
        }}))();
      }
      return this._parent;
    },
    getUrn: function() {
      return $.get(urls.get(['doc:urn', {pk: this.id}], 
                            {format: 'json', page_size: 0}));
    }
  });

  var Entity = Model.extend({
    rest: 'entity',
  });

  var RefsDecl = Model.extend({
    rest: 'refsdecl'
  });

  var Membership = Model.extend({
    rest: 'membership',
    getCommunity: function() {
      if (!this._community) {
        this._community = new Community({id: this.get('community')});
      }
      return this._community;
    },
    getUser: function() {
      if (!this._user) {
        this._user = new User({id: this.get('user')});
      }
      return this._user;
    },
    getRole: function () {
      if (!this._role) {
        this._role = new Role({id: this.get('role')});
      }
      return this._role;
    },
    getTasks: function () {
      if (!this._tasks) {
        this._tasks = new (Collection.extend({
          rest: ['membership:tasks', {pk: this.id}], model: Task
        }))();
      }
      return this._tasks;
    }
  });

  var Task = Model.extend({
    rest: 'task',
    status: {
      ASSIGNED: 0,
      IN_PROGRESS: 1,
      SUBMITTED: 2,
      COMPLETED: 3
    },
    getDoc: function () {
      if (!this._doc) {
        this._doc = new Doc({id: this.get('doc')});
      }
      return this._doc;
    }
  });

  var Role = Model.extend({
    rest: 'role'
  });

  var User = Model.extend({
    rest: 'user',
    getCommunities: function() {
      if (!this._communities) {
        this._communities = new (Collection.extend({
          rest: ['user:communities', {pk: this.id}], model: Community
        }))();
      }
      return this._communities;
    },
    getMemberships: function() {
      if (!this._memberships) {
        this._memberships = new (Collection.extend({
          rest: ['user:memberships', {pk: this.id}], model: Membership
        }))();
      }
      return this._memberships;
    }
  });

  var CSS = Model.extend({
    rest: 'css'
  });

  var JS = Model.extend({
    rest: 'js'
  });

  var DTD = Model.extend({
    rest: 'schema'
  });

  return {
    Model: Model,
    Collection: Collection,
    Community: Community,
    Doc: Doc,
    User: User,
    RefsDecl: RefsDecl
  };
});
