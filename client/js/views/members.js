define([
  'jquery', 'underscore', './modal', 'text!tmpl/members.html'
], function($, _, ModalView, tmpl) {
  'use strict';
  var MembersView = ModalView.extend({
    buttons: [
      {cls: "btn-default", text: 'Back', event: 'onBack'},
      {cls: "btn-default", text: 'Close', event: 'onClose'}
    ],
    bodyTemplate: _.template(tmpl),
    initialize: function() {
      var memberships = this.memberships = this.model.getMemberships();
      this.listenTo(memberships, 'add', this.onMembershipAdd);
      if (!memberships.isFetched()) {
        memberships.fetch();
      }
    },
    onMembershipAdd: function(member) {
      var $members = this.$('.members');
      $members.append($('<tr>' + 
          '<td>' + member.get('name') + '</td>' +
          '<td>' + member.get('create_date') + '</td>' +
          '<td>' + '</td>' +
          '<td>' + '</td>' +
          '<td>' + '</td>' +
          '<td>' + '</td>' +
          '<td>' + '</td>' +
        '</tr>'));
    },
    render: function() {
      ModalView.prototype.render.apply(this, arguments);
      this.memberships.each(this.onMembershipAdd, this);
      return this;
    }
  });

  return MembersView;  
});
