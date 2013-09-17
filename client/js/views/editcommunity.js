define(['jquery', 'underscore', './modal'], function($, _, ModalView) {
  var EditCommunityView = ModalView.extend({
    bodyTemplate: function() {
      return _.template($('#community-edit-tmpl').html())(this.model.toJSON());
    },
    events: {
      'click .edit-doc-refsdecl': 'onEditDocRefsDeclClick',
      'click .edit-entity-refsdecl': 'onEditEntityRefsDeclClick',
      'click .add-text-file': 'onAddTextFileClick',
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
      (new EditDocRefsDeclView({community: this.model})).render();
    },
    onEditEntityRefsDeclClick: function(){
      (new EditEntityRefsDeclView({community: this.model})).render();
    },
    onAddTextFileClick: function() {
      (new TEIUploadView({model: this.model})).render();
    },
    onAddJSClick: function() {
      (new JSUploadView({model: this.model})).render();
    },
    onAddCSSClick: function() {
      (new CSSUploadView({model: this.model})).render();
    },
    onAddImageZipClick: function() {
      (new ImageZipUploadView({model: this.model})).render();
    },
    onAddDTDClick: function() {
      (new DTDUploadView({model: this.model})).render();
    }
  });
  return EditCommunityView;
});