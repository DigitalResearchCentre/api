define(['backbone', 'urls'], function(Backbone, urls) {

  var Model = Backbone.Model.extend({
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
        this._docs = new Collection([], {
          rest: ['community:docs', this.id], model: Doc
        });
      }
      return this._docs;
    },
    getRefsdecls: function() {
      if (!this._refsdecls) {
        this._refsdecls = new Collection([], {
          rest: ['community:refsdecls'], model: RefsDecl
        });
      }
      return this._refsdecls;
    }
  });

  var Doc = Model.extend({
    rest: 'doc'
  });

  var RefsDecl = Model.extend({
    rest: 'refsdecl'
  })

  return {
    Model: Model,
    Collection: Collection,
    Community: Community,
    Doc: Doc,
    RefsDecl: RefsDecl
  };
});
