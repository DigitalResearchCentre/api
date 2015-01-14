define([
  'jquery', 'underscore', 'backbone',
  './editdoc', 'urijs/URI', 'env',
  'text!tmpl/pages.html', 
], function($, _, Backbone, EditDocView, URI, env, tmpl) {
  'use strict';

  var BackboneModel = Backbone.Model;
  var Collection = Backbone.Collection.extend({
    initialize: function(models, options) {
      _.defaults(this, {urlArgs: {}});
      if (options && options.urlArgs) {
        _.extend(this.urlArgs, options.urlArgs);
      }
    },
    url: function() {
      var url = _.result(this.model.prototype, 'urlRoot')
        , urlArgs = _.result(this, 'urlArgs')
      ;
      return url && URI(url).setSearch(urlArgs).normalize().toString() || null;
    },
    parse: function(data) {
      // TODO: parse meta offset
      if ( data && data.meta ) {
        this.meta = data.meta;
      }
      return data && data.objects || data;
    },
    hasNext: function() {
      var meta = this.meta;
      return meta && meta.next;
    },
    isFetched: function () {
      return this._fetched;
    },
    fetch: function() {
      this._fetched = true;
      // TODO: what if fetch fail ?
      return BackboneModel.prototype.fetch.apply(this, arguments);
    },
    retrieve: function() {
      if (!this.isFetched()) {
        return $.when(this.fetch()).then(function(){
          return this;
        });
      }
      return $.Deferred().resolve(this);
    }
  });

  var getIdFromUri = function(uri) {
    uri = new URI(uri);
    return uri.segment(-1) || uri.segment(-2);
  };

  var Model = BackboneModel.extend({
    url: function() {
      var url = this.get( 'resource_uri' )
      ;
      if (!url) {
        url = BackboneModel.prototype.url.apply(this, arguments);
      }
      if (url) {
        url = new URI(url).setSearch(_.result(this, 'urlArgs'));
        url = url.normalize().toString();
      }
      return url || null;
    },
    equal: function(m) {
      return this.constructor.equal(this, m);
    },
    isFetched: function () {
      return this._fetched;
    },
    fetch: function() {
      this._fetched = true;
      return BackboneModel.prototype.fetch.apply(this, arguments);
    },
    retrieve: function() {
      if (!this.isFetched() && !this.isNew()) {
        return $.when(this.fetch()).then(function(){
          return this;
        });
      }
      return $.Deferred().resolve(this);
    },
  }, {
    Collection: Collection,
    Models: {},
    equal: function(m1, m2) {
      return (m1 === m2) || (
        m1 && m2 && (
          (m1.cid && (m1.cid === m2.cid)) || (m1.id && (m1.id === m2.id))));
    },
    cache: function() { 
      return this._cache || (this._cache = new Collection());
    },
    get: function(id, nofetch) {
      if (_.isArray(id)) {
        if (nofetch) {
          return _.map(id, function(id){return this.get(id, nofetch);}, this);
        }
        return $.when.apply($, _.map(id, this.get, this));
      }

      var cache = this.cache()
        , model = cache.get(id)
      ;
      if (model) {
        if (nofetch) {
          return model;
        }
        return $.when(model);
      }else{
        model = new this({id: id});
        if (nofetch) {
          return model;
        }
        return $.when(model.fetch()).then(function() {return model;});
      }
    },
    extend: function() {
      var child = BackboneModel.extend.apply(this, arguments);
      child.Collection = Collection.extend({
        model: child
      });
      _.defaults(child, {relations: {}});
      _.each(child.relations, function(opts, name){
        if (opts.reverse) {
          opts.model.relations[opts.reverse] = {
            type: 'one',
            model: child,
            rel: name,
          };
        }
      });
      return child;
    },
  });

  var Page = Model.extend({
    urlRoot: env.restBase + '/v1/doc/',
    urlArgs: {fields: 'facs,rend', limit: 0},
  });

  var PageRowView = Backbone.View.extend({
    tagName: 'tr',
    events: {
      'click .btn.remove': 'onRemoveClick',
      'click .btn.save': 'onSaveClick',
    },
    initialize: function (options) {
      var page = this.model
        , $el = this.$el
      ;
      if (!page.isNew()) {
        $el.attr('data-id', page.id);
      }
      this.listenTo(page, 'change:id', function (page) {
        $el.attr('data-id', page.id);
      });
      this.onBack = options.onBack;
      this.options = options;
    },
    render: function () {
      var $span, $ul
        , model = this.model
      ;
      this.$el.html(
        '<td><input type="text" class="form-control attr name" ' + 
          'value="' + (model.get('name') || '')+ 
        '"/></td>' + 
        '<td><input type="text" class="form-control attr facs" ' + 
          'value="' + (model.get('facs') || '') +
        '"/></td>' + 
        '<td><input type="text" class="form-control attr rend" ' + 
          'value="' + (model.get('rend') || '') +
        '"/></td>' + 
        '<td>' + 
          '<span class="glyphicon glyphicon-floppy-disk btn save"></span>' +
          '<span class="glyphicon glyphicon-plus-sign btn append"></span>' +
          '<span class="glyphicon glyphicon-minus-sign btn remove"></span>' +
        '</td>'
      );
      return this;
    },
    onRemoveClick: function () {
      var $dfd = $.Deferred()
        , self = this
        , model = this.model
      ;
      if (!model.isNew()) {
        $dfd = model.destroy();
      }else{
        $dfd.resolve();
      }
      $dfd.done(function(){self.remove();});
    },
    onSaveClick: function (event) {
      var data = {
          name: this.$('input.attr.name').val(),
          facs: this.$('input.attr.facs').val(),
          rend: this.$('input.attr.rend').val(),
        }
        , model = this.model
      ;
      if (model.isNew()) {
        var tr = _.find(this.$el.prevAll(), function (tr) {
          return !!$(tr).data('id');
        });
        if (tr) {
          data.prev = $(tr).data('id');
        }
      }
      model.save(data, {patch: !model.isNew()});
    },
  });

  var PagesView = EditDocView.extend({
    buttons: [
      {cls: "btn-default", text: 'Back', event: 'onBack'},
      {cls: "btn-default", text: 'Close', event: 'onClose'}
    ],
    events: function () {
      var events = EditDocView.prototype.events;
      if (_.isFunction(events)) {
        events = events.apply(this);
      }
      return _.defaults({
        'click th .btn.append': 'onAppendNewClick',
        'click td .btn.append': 'onAppendClick',
      }, events);
    },
    bodyTemplate: _.template(tmpl),
    initialize: function(options) {
      EditDocView.prototype.initialize.apply(this, arguments);
      this._increaseWidth = 0;
      this.options = options;
    },
    onAppendNewClick: function(event) {
      var doc = this.getSelectedDoc()
        , page = new Page({parent: doc.id})
        , view = this.onPageAdd(page)
      ;
      this.$('.pages').prepend(view.$el);
    },
    onAppendClick: function(event) {
      var doc = this.getSelectedDoc()
        , page = new Page({parent: doc.id})
        , view = this.onPageAdd(page)
      ;
      $(event.target).closest('tr').after(view.$el);
    },
    onPageAdd: function(page) {
      var view = new PageRowView({
        parent: this,
        model: page, 
        onBack: _.bind(this.render, this),
        autoResize: _.bind(this.autoResize, this),
      });
      if (!this.pageviews) {
        this.pageviews = [];
      }
      this.pageviews.push(view);
      this.$('.pages').append(view.render().$el);
      this.autoResize();
      return view;
    },
    autoResize: function () {
      var $panel = this.$('.modal-body>.panel')
        , $table = $('.table', $panel)
        , $dialog = this.$('.modal-dialog')
        , diff = $table.width() - $panel.width()
      ;

      if (diff > 0) {
        this._increaseWidth += diff;
        $dialog.width($dialog.width() + diff);
      }
    },
    onDocChange: function() {
      var doc = this.getSelectedDoc();
      if (this.pages) {
        this.stopListening(this.pages);
      }
      _.each(this.pageviews, function(view) {
        view.remove();
      });
      if (doc) {
        this.pages = new (Page.Collection.extend({
          urlArgs: _.extend({parent: doc.id}, 
                            _.result(Page.prototype, 'urlArgs')),
        }))();
        this.listenTo(this.pages, 'add', this.onPageAdd);
        this.pages.retrieve();
      }
    },
    revertWidth: function () {
      var $dialog = this.$('.modal-dialog');
      $dialog.width($dialog.width() - this._increaseWidth);
      this._increaseWidth = 0;
    },
    onBack: function () {
      this.revertWidth();
      EditDocView.prototype.onBack.apply(this, arguments);
    },
    onClose: function () {
      this.revertWidth();
      EditDocView.prototype.onClose.apply(this, arguments);
    },
    render: function() {
      EditDocView.prototype.render.apply(this, arguments);
      var doc = this.getSelectedDoc();
      if (doc) {
      }
      console.log('doc');
      console.log(doc);

      //this.memberships.each(this.onPageAdd, this);
      return this;
    }
  });

  return PagesView;  
});
