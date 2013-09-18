define([
  'jquery', 'underscore', './modal', './editrefsdecl'
], function($, _, ModalView, EditRefsDeclView) {
  var ENTITY_REFSDECL_TYPE= 1;

  var EditDocRefsDeclView = EditRefsDeclView.extend({
    onRefsDeclAdd: function(refsdecl) {
      if (refsdecl.get('type') == ENTITY_REFSDECL_TYPE) {
        EditRefsDeclView.prototype.onRefsDeclAdd.apply(this, arguments);
      }
    },
    onBaseRefsDeclAdd: function(refsdecl) {
      if (refsdecl.get('type') == ENTITY_REFSDECL_TYPE) {
        EditRefsDeclView.prototype.onBaseRefsDeclAdd.apply(this, arguments);
      }
    },
    render: function() {
      EditRefsDeclView.prototype.render.apply(this, arguments);
      this.$('.intro').text(
        'We use the Text Encoding Initiative "RefDecls" element to map ' +
        'textual entity sections ' + 
        '(chapters, paragraphs; poems, stanzas, lines) to encodings ' +
        '(&lt;div/&gt;, &lt;p/&gt;, &lt;lg/&gt;, &lt;l/&gt;, etc.).')
      return this;
    },
    onSave: function() {
      var data = {type: 1};
      _.each(['name', 'description', 'xml', 'template'], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      this.model.set(data);
      return EditRefsDeclView.prototype.onSave.apply(this, arguments);
    }
  });
  return EditDocRefsDeclView;
});

