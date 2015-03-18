define([
  'jquery', 'underscore', './modal', './editrefsdecl',  
  'text!tmpl/edittextrefsdecl.html'
], function($, _, ModalView, EditRefsDeclView, tmpl) {
  'use strict';
  var TEXT_REFSDECL_TYPE= 2;

  var EditTextRefsDeclView = EditRefsDeclView.extend({
    bodyTemplate: _.template(tmpl),
    onRefsDeclAdd: function(refsdecl) {
      if (refsdecl.get('type') === TEXT_REFSDECL_TYPE) {
        var name = refsdecl.get('urn');
        this.$('.refsdecl-dropdown').append(
            $('<option value="'+refsdecl.id+'"/>').text(
              name + ' ' + refsdecl.get('description'))
        );
      }
    },
    getRefsdecls: function() {
      return this.community.getTextRefsdecls();
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

