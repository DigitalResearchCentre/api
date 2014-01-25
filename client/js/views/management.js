/*jslint browser: true, devel: true*/
define([
  'jquery', 'underscore', 'backbone', './modal', 'urls',
  'text!tmpl/management.html'
], function($, _, Backbone, ModalView, urls, tmpl) {
  'use strict';

  var ActionRowView = Backbone.View.extend({
    tagName: 'tr',
    initialize: function (options) {
      this.onBack = options.onBack;
      this.options = options;
    },
    render: function () {
      var $span, $ul,
      model = this.model;
      this.$el.html(
        '<td>' + model.get('action') + '</td>' + 
        '<td>' + model.get('user') + '</td>' + 
        '<td>' + model.get('created') + '</td>'
      );
      return this;
    },
  });

  var Action = Backbone.Model.extend({
    urlRoot: function() {
      return 'http://localhost:8000/v1/action/';
    }
  });
  var ManagementView  = ModalView.extend({
    buttons: [
      {cls: "btn-default", text: 'Back', event: 'onBack'},
      {cls: "btn-default", text: 'Close', event: 'onClose'},
      {cls: "btn-primary", text: 'Test', event: 'onTest'},
    ],
    bodyTemplate: _.template(tmpl),
    initialize: function(options) {
      return;
      var actions = this.actions = this.model.getActions();
      this.listenTo(actions, 'add', this.onActionAdd);
      if (!actions.isFetched()) {
        actions.fetch();
      }
      this._increaseWidth = 0;
      this.options = options;
    },
    onTest: function() {
      var action = new Action();
      action.set({
        action: 'test',
        doc: '1'
      });
      action.save();
    },
    onActionAdd: function(action) {
      var view = new ActionRowView({
        model: action, 
        autoResize: _.bind(this.autoResize, this),
      });
      this.$('.actions').append(view.render().$el);
      this.autoResize();
    },
    autoResize: function () {
      var
      $panel = this.$('.modal-body>.panel'),
      $table = $('.table', $panel),
      $dialog = this.$('.modal-dialog'),
      diff = $table.width() - $panel.width();

      if (diff > 0) {
        this._increaseWidth += diff;
        $dialog.width($dialog.width() + diff);
      }
    },
    revertWidth: function () {
      var $dialog = this.$('.modal-dialog');
      $dialog.width($dialog.width() - this._increaseWidth);
      this._increaseWidth = 0;
    },
    onBack: function () {
      this.revertWidth();
      ModalView.prototype.onBack.apply(this, arguments);
    },
    onClose: function () {
      this.revertWidth();
      ModalView.prototype.onClose.apply(this, arguments);
    },
    render: function() {
      ModalView.prototype.render.apply(this, arguments);
      //this.actions.each(this.onActionAdd, this);
      return this;
    }
  });

  return ManagementView;  
});
