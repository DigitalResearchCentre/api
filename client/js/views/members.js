define([
    'jquery', 'underscore', 'backbone', './modal', 'text!tmpl/members.html'
], function($, _, Backbone, ModalView, tmpl) {
    'use strict';

    var MembershipRowView = Backbone.View.extend({
        tagName: 'tr',
        initialize: function () {
            console.log(this.model);
            this.tasks = this.model.getTasks();
            this.listenTo(this.tasks, 'add', this.onTaskAdd);
        },
        render: function () {
            var model = this.model;
            this.$el.html(
                '<td>' + model.get('name') + '</td>' + 
                '<td>' + model.get('create_date') + '</td>' + 
                '<td class="assigned">' + '</td>' + 
                '<td class="in-progress">' + '</td>' + 
                '<td class="submitted">' + '</td>' +
                '<td class="completed">' + '</td>' +
                '<td><button class="btn btn-primary">assign</button></td>');
            this.tasks.each(this.onTaskAdd, this);
            return this;
        },
        onTaskAdd: function (task) {

        }
    });

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
            this._increaseWidth = 0;
        },
        onMembershipAdd: function(membership) {
            var view = new MembershipRowView({model: membership});

            this.$('.members').append(view.render().$el);
            this.autoResize();
        },
        autoResize: function () {
            var
            $panel = this.$('.modal-body>.panel'),
            $table = $('.table', $panel),
            $dialog = this.$('.modal-dialog'),
            diff = $table.width() - $panel.width();

            console.log(diff);
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
            this.memberships.each(this.onMembershipAdd, this);
            return this;
        }
    });

    return MembersView;  
});
