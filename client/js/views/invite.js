define([
  'jquery', 'underscore', 'urls', './modal', 'text!tmpl/invite.html'
], function($, _, urls, ModalView, tmpl) {
  'use strict';
  var InviteView = ModalView.extend({
    buttons: [
      {cls: "btn-default", text: 'Back', event: 'onBack'},
      {cls: "btn-default", text: 'Close', event: 'onClose'},
      {cls: "btn-primary", text: 'Invite', event: 'onInvite'}
    ],
    bodyTemplate: _.template(tmpl),
    onInvite: function () {
      var inviteUrl = urls.get('invite');
      $.post(inviteUrl, {
          community: this.model.id, role: 'role', 
          email: 'emails', content: 'content'
      });
    }
  });

  return InviteView;  
});
