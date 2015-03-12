define([
  'jquery', 'underscore', './modal', './editrefsdecl'
], function($, _, ModalView, EditRefsDeclView) {
  'use strict';
  var TEXT_REFSDECL_TYPE= 2;

  var EditTextRefsDeclView = EditRefsDeclView.extend({
    onRefsDeclAdd: function(refsdecl) {
      if (refsdecl.get('type') === TEXT_REFSDECL_TYPE) {
        var name = refsdecl.get('name') || refsdecl.get('urn');
        this.$('.refsdecl-dropdown').append(
            $('<option value="'+refsdecl.id+'"/>').text(
              name + ' ' + refsdecl.get('description'))
        );
      }
    },
    getRefsdecls: function() {
      return this.community.getTextRefsdecls();
    },
    render: function() {
      EditRefsDeclView.prototype.render.apply(this, arguments);
      this.$('.base-refsdecl.form-group').remove();
      this.$('.name.form-group').remove();
      return this;
    },
    onSave: function() {
      var data = {type: TEXT_REFSDECL_TYPE};
      _.each(['name', 'xml', 'template'], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      this.model.set(data);
      return EditRefsDeclView.prototype.onSave.apply(this, arguments);
    }
  });
  return EditTextRefsDeclView;
});

