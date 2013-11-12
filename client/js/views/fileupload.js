define([
  'jquery', 'underscore', 'urls', './modal'], function($, _, urls, ModalView) {
  var mediaURL = urls.mediaURL;
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
    getTmplData: function() {
      return {name: this.getName()};
    },
    getFormData: function() {
      var $form = this.$('form.fileupload');
      return new FormData($form[0]);
    },
    getName: function() {
      return 'file';
    },
    getUrl: function() {
      return '';
    },
    getFileList: function() {
      return null;
    },
    onFileAdd: function(file) {
      var name = this.getName()
        , path = file.get(name)
        , url = mediaURL + path
        , $li = $(
        '<li data-pk="' + file.id + '">' + 
        '<a target="_blank" href="' + url + '">' + path + '</a>' +
        '<a href="#" class="close" style="float: none">×</a>' +
        '</li>')
        , fList = this.getFileList()
      ;
      $('.close', $li).click(function() {
        var id = $li.data('pk');
        fList.get(id).destroy().done(function() {
          $li.remove();
        }).fail(function(resp) {
          this.$('.error').removeClass('hide').html(resp.responseText);
        });
      });
      this.$('.file-list').append($li);
    },
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
          var 
          myXhr = $.ajaxSettings.xhr(),
          $bar = $('.progress-bar', $progress);
          
          if(myXhr.upload){ // Check if upload property exists
            myXhr.upload.addEventListener('progress', function(e) {
              if(e.lengthComputable){
                var percent = (e.loaded*100.0)/e.total + '%';
                $bar.attr({
                    'aria-valuenow': e.loaded, 'aria-valuemax': e.total
                }).width(percent);
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
