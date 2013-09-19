define([
  'jquery', 'underscore', './modal', './editcommunity'
], function($, _, ModalView, EditCommunityView) {
  var CreateCommunityView = ModalView.extend({
    bodyTemplate: _.template($('#community-form-tmpl').html()),
    buttons: [
      {cls: "btn-default", text: 'Close', event: 'onClose'},
      {cls: "btn-primary", text: 'Create', event: 'onCreate'},
    ],
    onCreate: function() {
      var data = {};
      _.each([
        'name', 'abbr', 'long_name', 'font', 'description'
      ], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      return this.model.save(data).done(_.bind(function() {
        this.$('.error').addClass('hide');
        auth.getUser().getMemberships().fetch();
        (new EditCommunityView({model: this.model})).render();
      }, this)).fail(_.bind(function(resp) {
        this.$('.error').removeClass('hide').html(resp.responseText);
      }, this));
    },
    render: function() {
      ModalView.prototype.render.apply(this, arguments);
      this.$('.modal-title').text('Create Community');
      return this;
    },
  });
  return CreateCommunityView;   
});
