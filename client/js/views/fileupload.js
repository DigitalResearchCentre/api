define(['jquery', 'underscore', './modal'], function($, _, ModalView) {
  var FileUploadView = ModalView.extend({
    bodyTemplate: function() {
      return _.template($('#file-upload-tmpl').html(), this.getTmplData());
    },
    buttons: [
      {cls: "btn-default", text: 'Back', event: 'onBack'},
      {cls: "btn-primary", text: 'Upload', event: 'onUpload'},
    ],
    initialize: function() {
      var fList = this.getFileList();
      if (fList) {
        this.listenTo(fList, 'add', this.onFileAdd);
        if (!fList.isFetched()) {
          fList.fetch();
        }
      }
    },
    render: function() {
      ModalView.prototype.render.apply(this, arguments);
      this.$('.progress').hide();
      var fList = this.getFileList();
      if (fList) {
        fList.each(this.onFileAdd, this);
      }
      return this;
    },
    getFileList: function() {
      return null;
    },
    onFileAdd: function(file) {},
    onUpload: function() {
      var $progress = this.$('form.fileupload .progress').show()
        , $srOnly = $('.sr-only', $progress)
        , $error = this.$('.error')
        , that = this
        , fList = this.getFileList()
      ;
      $error.addClass('hide');
      $.ajax({
        url: this.getUrl(),
        type: 'POST',
        data: this.getFormData(),
        contentType: false,
        processData: false,
        xhr: function() {  // Custom XMLHttpRequest
          var myXhr = $.ajaxSettings.xhr();
          console.log(myXhr);
          if(myXhr.upload){ // Check if upload property exists
            myXhr.upload.addEventListener('progress', function(e) {
              if(e.lengthComputable){
                var percent = (e.loaded*100.0)/e.total + '%';
                $progress.attr({
                  'aria-valuenow': e.loaded, 'aria-valuemax': e.total
                }).width();
                $srOnly.text(percent);
              } 
            }, false); // For handling the progress of the upload
          }
          return myXhr;
        },
        success: function() {
          if (fList) {
            fList.fetch();
          }
          that.onBack();
        },
        error: function(resp) {
          that.$('.error').removeClass('hide').html(resp.responseText);
        }
      });
    }
  });
  return FileUploadView;
});
