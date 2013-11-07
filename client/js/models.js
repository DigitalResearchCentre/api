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
    url: function() {
      return urls.get(_.result(this, 'rest'), {page_size: 0, format: 'json'});
    },
    fetch: function(opts) {
      var dfd = Backbone.Collection.prototype.fetch.apply(this, arguments);
      return dfd.done(_.bind(function() {this._fetched = true;}, this)); 
    },
    isFetched: function() {
      return !!this._fetched;
    }
  });

  var Community = Model.extend({
    rest: 'community',
    getDocs: function() {
      if (!this._docs) {
        this._docs = new (Collection.extend({
          rest: ['community:docs', {pk: this.id}], model: Doc
        }))();
      }
      return this._docs;
    },
    getRefsdecls: function() {
      if (!this._refsdecls) {
        this._refsdecls = new (Collection.extend({
          rest: ['community:refsdecls', {pk: this.id}], model: RefsDecl
        }))();
      }
      return this._refsdecls;
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
    }
  });

  var RefsDecl = Model.extend({
    rest: 'refsdecl'
  });

  var Membership = Model.extend({
    rest: 'membership',
    getCommunity: function() {
      if (!this._community) {
        this._community = new Community(this.get('community'));
      }
      return this._community;
    }
  });

  var User = Model.extend({
    rest: 'users',
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
