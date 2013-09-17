define(['backbone', 'jquery', 'underscore'], function(Backbone, $, _) {
  var ModalView = Backbone.View.extend({
    el: $('#modal'),
    render: function() {
      var $footer = this.$('.modal-footer').empty();
      this.$('.modal-body').html(this.bodyTemplate());
      _.each(this.buttons, function(btn) {
        $footer.append($('<button/>').addClass('btn '+btn.cls)
                       .text(btn.text).click(_.bind(this[btn.event], this)));
      }, this);
      return this;
    },
    onClose: function() {
      this.$el.modal('hide');
    } 
  });
  return ModalView;   
});

