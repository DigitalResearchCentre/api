/*jslint browser: true, devel: true*/
define([
    'jquery', 'underscore', 'backbone', './modal', 'urls',
    'text!tmpl/members.html', 'dynatree'
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

    var AssignTaskView = ModalView.extend({
        buttons: [
            {cls: "btn-default", text: 'Assign Task', event: 'onAssign'},
            {cls: "btn-default", text: 'Back', event: 'onBack'},
            {cls: "btn-default", text: 'Close', event: 'onClose'}
        ],
        bodyTemplate: _.template(
            '<div class="error alert alert-block alert-warning hide"></div>' +
            '<div class="alert alert-success fade in hide">Success !</div>' +
            '<div class="assign-task-tree"></div>'),
        initialize: function(options){
            this.url = urls.get(
                ['membership:assign', {pk: this.model.id}], {format: 'json'});
            this.onBack = options.onBack;
        },
        render: function () {
            ModalView.prototype.render.apply(this, arguments);
            var $tree = this.$('.assign-task-tree')
              , expand = {}
              , self = this
              , url = urls.get(['membership:assign', {pk: this.model.id}])
            ;

            $tree.dynatree({
                checkbox: true,
                selectMode: 3,
                initAjax: {url: this.url},
                onLazyRead: function(node) {
                  node.appendAjax({
                    url: url + node.data.key + '/?format=json'
                  });
                },
                onExpand: function(flag, node) {
                    if (flag) {
                        expand[node.data.key] = flag;
                    }else{
                        delete expand[node.data.key];
                    }
                },
                onDblClick: function(node, event) {
                    node.toggleSelect();
                },
                onKeydown: function(node, event) {
                    if( event.which === 32 ) {
                        node.toggleSelect();
                        return false;
                    }
                }
            });

            return this;
        },
        onAssign: function() {
            var $tree = this.$('.assign-task-tree')
              , root = $tree.dynatree('getRoot')
              , selNodes = $tree.dynatree("getSelectedNodes")
              , url = urls.get(['membership:assign', {pk: this.model.id}])
              , datas = {}
              , self = this
            ;
            $.each(selNodes, function(i, node){
              var parent = node.parent;
              if (parent.parent) {
                // is page node
                var docPk = parent.data.key;
                if (!datas[docPk]){
                  datas[docPk] = {'docs': []};
                }
                datas[docPk].docs.push(node.data.key);
              }else{
                // is doc node, skip
              }
            });

            $.each(root.childList, function(i, node){
              var docPk = node.data.key;
              if (node.childList && node.childList.length > 0 && !datas[docPk]){
                datas[docPk] = {'docs': []};
              }
            });

            $.each(datas, function(i, d) {
              console.log(datas);
              console.log(i);
              console.log(d);
              $.post(url + i + '/?format=json', d).done(function(data){
                  $tree.dynatree({children: data});
                  self.$('.error').addClass('hide');
                  self.$('.alert-success').removeClass('hide').show();
              }).fail(function(resp) {
                  self.$('.error').removeClass('hide').html(resp.responseText);
              });
            });
        }
    });

    var MembershipRowView = Backbone.View.extend({
        tagName: 'tr',
        initialize: function (options) {
            this.onBack = options.onBack;
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
                '<td><button class="btn btn-primary assign">assign</button></td>'
            );
            this.tasks.each(this.onTaskAdd, this);
            this.tasks.fetch();
            this.$('td>ul').addClass('folder folder-close');
            this.$('td>span').
                addClass('btn glyphicon glyphicon-folder-close').
                click(_.bind(this.onToggleClick, this));
            this.$('td>.btn.assign').click(_.bind(this.onAssignClick, this));
            return this;
        },
        onAssignClick: function(event){
            var view = new AssignTaskView({
                model: this.model, 
                onBack: _.bind(this.onBack, this)
            });
            return view.render();
        },
        onToggleClick: function (event){
            var $el = $(event.target);
            $el.toggleClass('glyphicon-folder-close glyphicon-folder-open');
            $el.siblings('ul').toggleClass('folder-open folder-close');
            if ($el.hasClass('glyphicon-folder-open')) {
              this.tasks.each(function(task){
                if (!task._docFetched) {
                  var doc = task.getDoc()
                    , $a = task.$a
                  ;
                  doc.getUrn().done(function (urn){
                      var name = [];
                      _.each(urn.split(':'), function (parts) {
                          parts = parts.split('=');
                          if (parts.length > 1) {
                              name.push(parts[1]);
                          }
                      });
                      $a.text(name.join(':'));
                  });
                  doc.fetch().done(function(){
                    task._docFetched = true;
                  });
                }
              });
            }
        },
        onTaskAdd: function (task) {
            var cls, $td, $ul, $a,
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

            $a = $('<a href="#task=' + task.id + '">'+task.id+'</a>');
            $a.click(_.bind(function () {
                this.options.viewTask(task);
            }, this));
            $ul.append($('<li></li>').append($a));
            task.$a = $a;
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
                onBack: _.bind(this.render, this),
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
            var community = this.model;
            var url = urls.get(['community:friendly_url', {pk: community.id}]);
            $.get(url, function(friendlyURL) {
                if (parent.isNew()) {
                    parent.fetch().done(function() {
                        var url = friendlyURL + '/viewer?' + 
                              'docName=' + parent.get('name') + 
                              '&pageName=' + doc.get('name');
                        window.parent.location = url;
                    });
                }else{
                    var url = friendlyURL + '/viewer?' +
                          'docName=' + parent.get('name') +
                          '&pageName=' + doc.get('name');
                    window.parent.location = url;
                }
            });

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
