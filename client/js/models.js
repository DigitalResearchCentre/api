define(['backbone', 'urls'], function(Backbone, urls) {

  var Model = Backbone.Model.extend({
    url: function() {
      var url = Backbone.Model.prototype.url.apply(this, arguments);
      return url + (url.charAt(url.length - 1 ) == '/' ? '' : '/' );
    },
    urlRoot: function() {
      return urls.get(_.result(this, 'rest'));
    }
  });

  var Collection = Backbone.Collection.extend({
    url: function() {
      return urls.get(_.result(this, 'rest'), {page_size: 0, format: 'json'})
    }
  });

  var Community = Model.extend({
    rest: 'community',
    getDocs: function() {
      if (!this._docs) {
        this._docs = new (Collection.extend({
          rest: ['community:docs', {pk: this.id}], model: Doc
        }));
      }
      return this._docs;
    },
    getRefsdecls: function() {
      if (!this._refsdecls) {
        this._refsdecls = new (Collection.extend({
          rest: ['community:refsdecls', {pk: this.id}], model: RefsDecl
        }));
      }
      return this._refsdecls;
    }
  });

  var Doc = Model.extend({
    rest: 'doc'
  });

  var RefsDecl = Model.extend({
    rest: 'refsdecl'
  });

  var User = Model.extend({
    rest: 'users'
  });

  return {
    Model: Model,
    Collection: Collection,
    Community: Community,
    Doc: Doc,
    RefsDecl: RefsDecl
  };
});
