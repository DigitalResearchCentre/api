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
      this.delegateEvents();
      return this;
    },
    onClose: function() {
      this.$el.modal('hide');
    },
    onBack: function() {
      var back = this.options.onBack;
      if (back) return back();
    }
  });
  return ModalView;   
});

