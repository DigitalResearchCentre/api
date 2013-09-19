define([
  'jquery', 'underscore',
  './modal', './editdocrefsdecl', './editentityrefsdecl',
  'text!tmpl/communityedit.html'
], function(
  $, _, 
  ModalView, EditDocRefsDeclView, EditEntityRefsDeclView, tmpl
) {
  var EditDocView = ModalView.extend({
    bodyTemplate: function() {
      return _.template($('#edit-doc-tmpl').html());
    },
    buttons: [
      {cls: "btn-default", text: 'Back', event: 'onBack'},
      {cls: "btn-default", text: 'Close', event: 'onClose'},
    ],
    initialize: function(options) {
      var buttons = this.buttons
        , docs = this.docs = this.model.getDocs()
      ;
      _.each(options.buttons, function(btn) {
        buttons.push(btn);
      });
      this.listenTo(docs, 'add', this.onDocAdd);
      if (!docs.isFetched()) {
        this.docs.fetch();
      }
    },
    onDocAdd: function(doc) {
      this.$('.doc-dropdown').append(
        $('<option/>').val(doc.id).text(doc.get('name')));
    },
    render: function() {
      ModalView.prototype.render.apply(this, arguments);
      this.docs.each(this.onDocAdd, this);
      return this;
    }
  });

  var EditCommunityView = ModalView.extend({
    bodyTemplate: function() {
      return _.template(tmpl)(this.model.toJSON());
    },
    events: {
      'click .add-text-file': 'onAddTextFileClick',
      'click .add-image-zip': 'onAddImageZipClick',
      'click .get-doc-xml': 'onGetDocXMLClick',
      'click .rename-doc': 'onRenameDocClick',
      'click .delete-doc': 'onDeleteDocClick',
      'click .delete-doc-text': 'onDeleteDocTextClick',
      'click .edit-doc-refsdecl': 'onEditDocRefsDeclClick',
      'click .edit-entity-refsdecl': 'onEditEntityRefsDeclClick',
      'click .add-js': 'onAddJSClick',
    },
    buttons: [
      {cls: "btn-default", text: 'Close', event: 'onClose'},
      {cls: "btn-primary", text: 'Update', event: 'onUpdate'},
    ],
    onUpdate: function() {
      var data = {};
      _.each([
        'name', 'abbr', 'long_name', 'font', 'description'
      ], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      return this.model.save(data).done(_.bind(function() {
        this.$('.error').addClass('hide');
      }, this)).fail(_.bind(function(resp) {
        this.$('.error').removeClass('hide').html(resp.responseText);
      }, this));
    },
    onEditDocRefsDeclClick: function(){
      var view = new EditDocRefsDeclView({
        community: this.model, onBack: _.bind(this.render, this)
      });
      return view.render();
    },
    onEditEntityRefsDeclClick: function(){
      var view = new EditEntityRefsDeclView({
        community: this.model, onBack: _.bind(this.render, this)
      });
      return view.render();
    },
    onAddTextFileClick: function() {
      (new TEIUploadView({model: this.model})).render();
    },
    onAddImageZipClick: function() {
      (new ImageZipUploadView({model: this.model})).render();
    },
    onGetDocXMLClick: function() {
      (new EditDocView({model: this.model})).render();
    },
    onRenameDocClick: function() {
      (new TEIUploadView({model: this.model})).render();
    },
    onDeleteDocClick: function() {
      (new TEIUploadView({model: this.model})).render();
    },
    onDeleteDocTextClick: function() {
      (new TEIUploadView({model: this.model})).render();
    },
    onAddJSClick: function() {
      (new JSUploadView({model: this.model})).render();
    },
    onAddCSSClick: function() {
      (new CSSUploadView({model: this.model})).render();
    },
    onAddDTDClick: function() {
      (new DTDUploadView({model: this.model})).render();
    },
    onDocMenuClick: function() {
      (new EditDocView({
        model: this.model, onBack: _.bind(this.render, this)
      })).render();
    }
  });
  return EditCommunityView;
});
