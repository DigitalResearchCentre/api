define([
  'jquery', 'underscore', './modal'
], function($, _, ModalView) {
  'use strict';

  var EditDocView = ModalView.extend({
    bodyTemplate: function() {
      return _.template($('#edit-doc-tmpl').html());
    },
    events: {
      'change .doc-dropdown': 'onDocChange'
    },
    initialize: function(options) {
        this.options = options;
        var docs = this.docs = this.model.getDocs();
        this.listenTo(docs, 'add', this.onDocAdd);
        if (!docs.isFetched()) {
            this.docs.fetch();
        }
    },
    getSelectedDoc: function() {
      return this.docs.get(this.$('.doc-dropdown').val());
    },
    onDocAdd: function(doc) {
      var $docs = this.$('.doc-dropdown');
      $docs.append($('<option/>').val(doc.id).text(doc.get('name')));
      if ($('option', $docs).length === 1) {
        this.onDocChange();
      }
    },
    onDocChange: function() {
    },
    render: function() {
      ModalView.prototype.render.apply(this, arguments);
      this.docs.each(this.onDocAdd, this);
      return this;
    }
  });

  return EditDocView;
});

