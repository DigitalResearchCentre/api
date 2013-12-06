define([
    'jquery', 'underscore', 'models', './modal'
], function($, _, models, ModalView) {
    var 
    RefsDecl = models.RefsDecl,
    baseRefsDecls = new (models.Collection.extend({ 
        rest: ['community:refsdecls', {pk: 1}]
    }))(),
    EditRefsDeclView = ModalView.extend({
        bodyTemplate: _.template($('#refsdecl-form-tmpl').html()),
        events: {
            'change .base-refsdecl-dropdown': 'onBaseRefsDeclChange',
            'change .refsdecl-dropdown': 'onRefsDeclChange'
        },
        buttons: [
            {cls: "btn-default", text: 'Back', event: 'onBack'},
            {cls: "btn-default", text: 'Close', event: 'onClose'},
            {cls: "btn-primary", text: 'Save', event: 'onSave'}
        ],
        initialize: function(options) {
            this.options = options;
            this.refsdecls = this.options.community.getRefsdecls();
            this.listenTo(baseRefsDecls, 'add', this.onBaseRefsDeclAdd);
            this.listenTo(this.refsdecls, 'add', this.onRefsDeclAdd);
            this.model = new RefsDecl();
            if (!baseRefsDecls.isFetched()) {
                baseRefsDecls.fetch();
            }
            if (!this.refsdecls.isFetched()) {
                this.refsdecls.fetch();
            }
        },
        onRefsDeclAdd: function(refsdecl) {
            this.$('.refsdecl-dropdown').append(
                $('<option value="'+refsdecl.id+'"/>')
                .text(refsdecl.get('name') + ' ' + refsdecl.get('description'))
            );
        },
        onBaseRefsDeclAdd: function(refsdecl) {
            this.$('.base-refsdecl-dropdown').append(
                $('<option value="'+refsdecl.id+'"/>')
                .text(refsdecl.get('name') + ' ' + refsdecl.get('description'))
            );
        },
        onRefsDeclChange: function() {
            var refsdecl = this.refsdecls.get(this.$('.refsdecl-dropdown').val());
            if (refsdecl) {
                this.model = refsdecl;
            }else{
                refsdecl = this.model = new RefsDecl();
            }
            this.$('#form-field-name').val(refsdecl.get('name'));
            this.$('#form-field-description').val(refsdecl.get('description'));
            this.$('#form-field-xml').val(refsdecl.get('xml'));
            this.$('#form-field-template').val(refsdecl.get('template'));
        },
        onBaseRefsDeclChange: function() {
            var id = this.$('.base-refsdecl-dropdown').val()
                , refsdecl = baseRefsDecls.get(id)
            ;
            if (refsdecl) {
                this.$('#form-field-xml').val(refsdecl.get('xml'));
                this.$('#form-field-template').val(refsdecl.get('template'));
            }
        },
        render: function() {
            ModalView.prototype.render.apply(this, arguments);
            baseRefsDecls.each(this.onBaseRefsDeclAdd, this);
            this.refsdecls.each(this.onRefsDeclAdd, this);
            this.$('.base-refsdecl-dropdown').prop('selectedIndex', -1);
            return this;
        },
        onSave: function() {
            var refsdecls = this.refsdecls
                , model = this.model
                , isNew = model.isNew()
            ;
            if (isNew) {
                model.set('community', this.options.community.id);
            }
            return model.save().done(_.bind(function() {
                var $alert = this.$('.alert-success').removeClass('hide').show();
                this.$('.error').addClass('hide');
                _.delay(function() {$alert.hide(1000);}, 2000);
                if (isNew) {
                    refsdecls.fetch();
                }
            }, this)).fail(_.bind(function(resp) {
                this.$('.error').removeClass('hide').html(resp.responseText);
            }, this));
        }
    });

    return EditRefsDeclView;
});

