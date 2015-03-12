define([
  'jquery', 'underscore', './modal', './editrefsdecl'
], function($, _, ModalView, EditRefsDeclView) {
  var DOC_REFSDECL_TYPE = 0;

  var EditDocRefsDeclView = EditRefsDeclView.extend({
    onRefsDeclAdd: function(refsdecl) {
      if (refsdecl.get('type') === DOC_REFSDECL_TYPE) {
        EditRefsDeclView.prototype.onRefsDeclAdd.apply(this, arguments);
      }
    },
    onBaseRefsDeclAdd: function(refsdecl) {
      if (refsdecl.get('type') === DOC_REFSDECL_TYPE) {
        EditRefsDeclView.prototype.onBaseRefsDeclAdd.apply(this, arguments);
      }
    },
    render: function() {
      EditRefsDeclView.prototype.render.apply(this, arguments);
      this.$('.intro').text(
        'We use the Text Encoding Initiative "RefDecls" element to map ' + 
        'document sections (pages, columns) to encodings ' +
        '(<pb/>, <cb/>, etc.);');
      this.$('.refsdecl-template').hide();
      return this;
    },
    onSave: function() {
      var data = {type: DOC_REFSDECL_TYPE};
      _.each(['name', 'xml'], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      this.model.set(data);
      return EditRefsDeclView.prototype.onSave.apply(this, arguments);
    }
  });
  return EditDocRefsDeclView;
});

