define([
    'jquery', 'underscore', 'backbone', './modal', 'urls',
    'text!tmpl/members.html'
], function($, _, Backbone, ModalView, urls, tmpl) {
    'use strict';

    function initTree($tree) {
        $tree.children('ul').attr('role', 'tree').
            find('ul').attr('role', 'group');
        $tree.find('li:has(ul)').addClass('parent_li').attr('role', 'treeitem').
            find(' > span').attr('title', 'Collapse this branch').
            on('click', function (e) { 
            var children = $(this).parent('li.parent_li').find(' > ul > li');
            if (children.is(':visible')) {
                children.hide('fast');
                $(this).attr('title', 'Expand this branch').find(' > i').
                    addClass('icon-plus-sign').removeClass('icon-minus-sign');
            } else {
                children.show('fast');
                $(this).attr('title', 'Collapse this branch').find(' > i').
                    addClass('icon-minus-sign').removeClass('icon-plus-sign');
            }
            e.stopPropagation();
        });
    }

    var MembershipRowView = Backbone.View.extend({
        tagName: 'tr',
        initialize: function (options) {
            this.tasks = this.model.getTasks();
            this.listenTo(this.tasks, 'add', this.onTaskAdd);
            this.options = options;
        },
        render: function () {
            var $span, $ul,
            model = this.model;
            this.$el.html(
                '<td>' + model.get('name') + '</td>' + 
                '<td>' + model.get('create_date') + '</td>' + 
                '<td class="assigned"><span> 0 tasks</span><ul></ul></td>' + 
                '<td class="in-progress"><span> 0 tasks</span><ul></ul></td>' + 
                '<td class="submitted"><span> 0 tasks</span><ul></ul></td>' +
                '<td class="completed"><span> 0 tasks</span><ul></ul></td>' +
                '<td><button class="btn btn-primary">assign</button></td>'
            );
            this.tasks.each(this.onTaskAdd, this);
            this.tasks.fetch();
            this.$('td>ul').addClass('folder folder-close');
            this.$('td>span').
                addClass('btn glyphicon glyphicon-folder-close').
                click(_.bind(this.onToggleClick, this));
            return this;
        },
        onToggleClick: function (event){
            var $el = $(event.target);
            $el.toggleClass('glyphicon-folder-close glyphicon-folder-open');
            $el.siblings('ul').toggleClass('folder-open folder-close');
        },
        onTaskAdd: function (task) {
            var cls, $td, $ul, $a,
            doc = task.getDoc(),
            status = task.status;

            switch (task.get('status')) {
                case status.ASSIGNED:
                    cls = 'assigned';
                break;
                case status.IN_PROGRESS:
                    cls = 'in-progress';
                break;
                case status.SUBMITTED:
                    cls = 'submitted';
                break;
                case status.COMPLETED:
                    cls = 'completed';
                break;
                default:
                    return;
            }
            $td = this.$('.' + cls);
            $ul = $td.children('ul');
            $a = $('<a href="#task=' + task.id + '">'+doc.get('name')+'</a>');
            doc.getUrn().done(function(urn){
                var name = [];
                _.each(urn.split(':'), function (parts) {
                    parts = parts.split('=');
                    if (parts.length > 1) {
                        name.push(parts[1]);
                    }
                });
                $a.text(name.join(':'));
            });
            $a.click(_.bind(function () {
                this.options.viewTask(task);
            }, this));
            this.listenTo(doc, 'change', function () {
                $a.text(doc.get('name'));
            });
            doc.fetch();
            $ul.append($('<li></li>').append($a));
            $td.children('span').text(' ' + $ul.children().length + ' tasks');
            this.options.autoResize();
        }
    });

    var TaskView = ModalView.extend({
        buttons: [
            {cls: "btn-default", text: 'Back', event: 'onBack'},
            {cls: "btn-default", text: 'Close', event: 'onClose'}
        ],
        bodyTemplate: _.template('<textarea></textarea>'),
        render: function () {
            var doc = this.model.getDoc();
            this.$('textarea').val(doc.get('name'));
        }
    });

    var MembersView = ModalView.extend({
        buttons: [
            {cls: "btn-default", text: 'Back', event: 'onBack'},
            {cls: "btn-default", text: 'Close', event: 'onClose'}
        ],
        bodyTemplate: _.template(tmpl),
        initialize: function(options) {
            var memberships = this.memberships = this.model.getMemberships();
            this.listenTo(memberships, 'add', this.onMembershipAdd);
            if (!memberships.isFetched()) {
                memberships.fetch();
            }
            this._increaseWidth = 0;
            this.options = options;
        },
        onMembershipAdd: function(membership) {
            var view = new MembershipRowView({
                model: membership, 
                autoResize: _.bind(this.autoResize, this),
                viewTask: _.bind(this.viewTask, this)
            });
            this.$('.members').append(view.render().$el);
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
        viewTask: function (task) {
            var doc = task.getDoc();
            var parent = doc.getParent();
            var model = this.model;
            if (parent.isNew()) {

                parent.fetch().done(function() {
                    var url = 'http://www.textualcommunities.usask.ca/web/' 
                        + 'textual-community/viewer?community=' + model.id 
                        + '&docName=' + parent.get('name') 
                        + '&pageName=' + doc.get('name');

                    urls.window.open(url, '_blank');
                });
            }else{
                var url = 'http://www.textualcommunities.usask.ca/web/' 
                    + 'textual-community/viewer&community=' + model.id 
                    + '&docName=' + parent.get('name') 
                    + '&pageName=' + doc.get('name');

                urls.window.open(url, '_blank');
            }
            /*
            (new TaskView({
                model: task, onBack: _.bind(this.onBack, this)
            })).render();
            */
        },
        render: function() {
            ModalView.prototype.render.apply(this, arguments);
            this.memberships.each(this.onMembershipAdd, this);
            return this;
        }
    });

    return MembersView;  
});
