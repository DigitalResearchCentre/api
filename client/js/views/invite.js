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
            var 
            inviteUrl = urls.get('invite'),
            data = {
                community: this.model.id, 
                role: this.$('#form-field-role').val(), 
                emails: this.$('#form-field-email').val(), 
                content: this.$('#form-field-content').val()
            };

            $.post(inviteUrl, data, _.bind(function (resp) {
                if (resp.status === 'success') {
                    this.$('.alert-success').removeClass('hide').show();
                }else{
                    this.$('.error').removeClass('hide').html(resp.msg);
                }
            }, this), 'json').fail(_.bind(function (resp) {
                this.$('.error').removeClass('hide').html(resp.responseText);
            }, this));
        }
    });

    return InviteView;  
});
