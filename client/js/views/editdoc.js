define([
  'jquery', 'underscore', './modal'
], function($, _, ModalView) {
  'use strict';
  var EditDocView = ModalView.extend({
    buttons: [
      {cls: "btn-default", text: 'Back', event: 'onBack'},
      {cls: "btn-default", text: 'Close', event: 'onClose'}
    ],
    initialize: function() {
      var docs = this.docs = this.model.getDocs();
      if (!docs.isFetched()) {
        docs.fetch();
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

  return EditDocView;
});
