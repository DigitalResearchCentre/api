define([
  'jquery', 'underscore', './modal'
], function($, _, ModalView) {
  'use strict';
  var DocListView = ModalView.extend({
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
      _.each([{
        text: 'Add Image Zip', click: ''
      }, {
        text: 'Get XML', click: ''
      }, {
        text: 'Rename', click: ''
      }, {
        text: 'Delete Text', click: ''
      }, {
        text: 'Delete', click: ''
      }], function(data) {
        $('<button/>').
          addClass('btn btn-primary').
          text(data.text).click(data.click);
      });
    },
    render: function() {
      ModalView.prototype.render.apply(this, arguments);
      this.docs.each(this.onDocAdd, this);
      return this;
    }
  });

  return DocListView;
});
