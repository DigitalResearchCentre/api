define([
  'jquery', 'underscore', 'urls',
  './modal', './editdocrefsdecl', './editentityrefsdecl', './fileupload', 
  'text!tmpl/communityedit.html'
], function(
  $, _, urls,
  ModalView, EditDocRefsDeclView, EditEntityRefsDeclView, FileUploadView, tmpl
) {
  var mediaURL = 'http://textualcommunities.usask.ca/media/tc/';

  var TEIUploadView = FileUploadView.extend({
    getTmplData: function() {
      return {name: 'xml'};
    },
    getFormData: function() {
      var $form = this.$('form.fileupload');
      return new FormData($form[0]);
    },
    getUrl: function() {
      return urls.get(['community:upload-tei', {community: this.model.id}]);
    }
  });

  var JSUploadView = FileUploadView.extend({
    getFileList: function() {
      return this.model.getJS();
    },
    getTmplData: function() {
      return {name: 'js'};
    },
    getFormData: function() {
      var $form = this.$('form.fileupload');
      return new FormData($form[0]);
    },
    getUrl: function() {
      return urls.get(['community:upload-js', {community: this.model.id}]);
    },
    onFileAdd: function(file) {
      var url = mediaURL + file.get('js')
        , $li = $(
        '<li data-pk="' + file.id + '">' + 
        '<a target="_blank" href="' + url + '">' + file.get('js') + '</a>' +
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
    }
  });

  var CSSUploadView = FileUploadView.extend({
    getTmplData: function() {
      return {name: 'css'};
    },
    getFormData: function() {
      var $form = this.$('form.fileupload');
      return new FormData($form[0]);
    },
    getUrl: function() {
      return urls.get(['community:upload-css', {community: this.model.id}]);
    },
    getFileList: function() {
      return this.model.getCSS();
    },
    onFileAdd: function(file) {
      var url = mediaURL + file.get('css')
        , $li = $(
        '<li data-pk="' + file.id + '">' + 
        '<a target="_blank" href="' + url + '">' + file.get('css') + '</a>' +
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
    }
  });

  var DTDUploadView = FileUploadView.extend({
    getTmplData: function() {
      return {name: 'schema'};
    },
    getFormData: function() {
      var $form = this.$('form.fileupload');
      return new FormData($form[0]);
    },
    getUrl: function() {
      return urls.get(['community:upload-dtd', {community: this.model.id}]);
    },
    getFileList: function() {
      return this.model.getDTD();
    },
    onFileAdd: function(file) {
      var url = mediaURL + file.get('schema')
        , $li = $(
        '<li data-pk="' + file.id + '">' + 
        '<a target="_blank" href="' + url + '">' + 
        file.get('schema') + '</a>' +
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
    render: function() {
      FileUploadView.prototype.render.apply(this, arguments);
      this.$('.file-list').before('<label>Default DTD:</label>');
      var $ul = $('<ul></ul>');
      this.$('.file-list').before($ul);
      this.$('.file-list').before('<label>Community DTD:</label>');
      var dtds = this.model.getDefaultDTD();
      if (dtds.isFetched()){
        dtds.each(function(file) {
          $ul.append('<li>' + file.get('schema') + '</li>');
        });
      }else{
        dtds.fetch().done(function() {
          dtds.each(function(file) {
            var url = mediaURL + file.get('schema');
            $ul.append(
              '<li data-pk="' + file.id + '">' + 
              '<a target="_blank" href="' + url + '">' + file.get('schema') +
              '</a></li>');
          });
        });
      }
      return this;
    },
  });

  var EditDocView = ModalView.extend({
    bodyTemplate: function() {
      return _.template($('#edit-doc-tmpl').html());
    },
    events: {
      'change .doc-dropdown': 'onDocChange'
    },
    initialize: function(options) {
      var docs = this.docs = this.model.getDocs();
      this.listenTo(docs, 'add', this.onDocAdd);
      if (!docs.isFetched()) {
        this.docs.fetch();
      }
    },
    getSelectedDoc: function() {
      return this.docs.get(this.$('.doc-dropdown').val());
    },
    onDocAdd: function(doc) {
      var $docs = this.$('.doc-dropdown');
      $docs.append($('<option/>').val(doc.id).text(doc.get('name')));
      if ($('option', $docs).length === 1) {
        this.onDocChange();
      }
    },
    onDocChange: function() {
    },
    render: function() {
      ModalView.prototype.render.apply(this, arguments);
      this.docs.each(this.onDocAdd, this);
      return this;
    }
  });

  var ImageZipUploadView = EditDocView.extend({
    buttons: [
      {cls: "btn-default", text: 'Back', event: 'onBack'},
      {cls: "btn-default", text: 'Close', event: 'onClose'},
      {cls: "btn-upload btn-primary", text: 'Upload', event: 'onUpload'}
    ],
    render: function() {
      EditDocView.prototype.render.apply(this, arguments);
      this.$('.modal-body').append($('#image-zip-tmpl').html());
      this.$('.progress').hide();
      return this;
    },
    getFormData: function() {
      var $form = this.$('form.fileupload');
      return new FormData($form[0]);
    },
    getUrl: function() {
      var doc = this.getSelectedDoc();
      return urls.get(['doc:upload-image-zip', {pk: doc.id}]);
    },
    onUpload: function() {
      var $progress = this.$('form.fileupload .progress').show()
        , $srOnly = $('.sr-only', $progress)
        , $error = this.$('.error')
        , that = this
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
        error: function(resp) {
          that.$('.error').removeClass('hide').html(resp.responseText);
        }
      }).done(_.bind(function() {
        var $alert = this.$('.alert-success').removeClass('hide').show();
        this.$('.error').addClass('hide');
        _.delay(function() {$alert.hide(1000);}, 2000);
      }, this)).fail(_.bind(function(resp) {
        this.$('.error').removeClass('hide').html(resp.responseText);
      }, this));
    }
  });

  var GetDocXMLView = EditDocView.extend({
    buttons: [
      {cls: "btn-default", text: 'Back', event: 'onBack'},
      {cls: "btn-default", text: 'Close', event: 'onClose'},
    ],
    onDocChange: function() {
      var id = this.$('.doc-dropdown').val()
        , $xml = this.$('.doc-xml')
      ;
      $.get(urls.get(
        ['doc:xml', {pk: id}], 
        {format: 'json', page_size: 0}
      ), function(data) {
        $xml.text(data[0]); 
      });
    },
    render: function() {
      EditDocView.prototype.render.apply(this, arguments);
      this.$('form').append($('<pre/>').addClass('doc-xml'));
      return this;
    }
  });

  var RenameDocView = EditDocView.extend({
    buttons: [
      {cls: "btn-default", text: 'Back', event: 'onBack'},
      {cls: "btn-default", text: 'Close', event: 'onClose'},
      {cls: "btn-primary", text: 'Rename', event: 'onRenameClick'}
    ],
    getSelectedDoc: function() {
      return this.docs.get(this.$('.doc-dropdown').val());
    },
    onRenameClick: function() {
      var $option = this.$('.doc-dropdown').find(':selected')
        , doc = this.getSelectedDoc()
      ;
      doc.set('name', this.$('.form-field-name').val());
      return doc.save().done(_.bind(function() {
        var $alert = this.$('.alert-success').removeClass('hide').show();
        $option.text(doc.get('name'));
        this.$('.error').addClass('hide');
        _.delay(function() {$alert.hide(1000);}, 2000);
      }, this)).fail(_.bind(function(resp) {
        this.$('.error').removeClass('hide').html(resp.responseText);
      }, this));

    },
    onDocChange: function() {
      this.$('.form-field-name').val(this.getSelectedDoc().get('name'));
    },
    render: function() {
      EditDocView.prototype.render.apply(this, arguments);
      this.$('form').append($('#rename-doc-tmpl').html());
      return this;
    }
  });

  var DeleteDocView = EditDocView.extend({
    buttons: [
      {cls: "btn-default", text: 'Back', event: 'onBack'},
      {cls: "btn-default", text: 'Close', event: 'onClose'},
      {cls: "btn-danger", text: 'DELETE', event: 'onDeleteClick'}
    ],
    onDeleteClick: function() {
      var $option = this.$('.doc-dropdown').find(':selected');
      return this.getSelectedDoc().destroy().done(_.bind(function() {
        var $alert = this.$('.alert-success').removeClass('hide').show();
        $option.remove();
        this.$('.error').addClass('hide');
        _.delay(function() {$alert.hide(1000);}, 2000);
      }, this)).fail(_.bind(function(resp) {
        this.$('.error').removeClass('hide').html(resp.responseText);
      }, this));
    }
  });

  var DeleteDocTextView = DeleteDocView.extend({
    onDeleteClick: function() {
      var text = this.getSelectedDoc().getText()
        , fail = _.bind(function(resp) {
          this.$('.error').removeClass('hide').html(resp.responseText);
        }, this)
        , that = this
      ;
      if (text.isNew()) {
        text.fetch().done(function() {
          console.log(text);
          text.destroy().done(function() {
            var $alert = that.$('.alert-success').removeClass('hide').show();
            that.$('.error').addClass('hide');
            _.delay(function() {$alert.hide(1000);}, 2000);
          }).fail(fail);
        }).fail(fail);
      }
    }
  });


  var EditCommunityView = ModalView.extend({
    bodyTemplate: function() {
      return _.template(tmpl)(this.model.toJSON());
    },
    events: {
      'click .add-text-file': 'onAddTextFileClick',
      'click .add-image-zip': 'onAddImageZipClick',
      'click .get-doc-xml': 'onGetDocXMLClick',
      'click .rename-doc': 'onRenameDocClick',
      'click .delete-doc': 'onDeleteDocClick',
      'click .delete-doc-text': 'onDeleteDocTextClick',
      'click .edit-doc-refsdecl': 'onEditDocRefsDeclClick',
      'click .edit-entity-refsdecl': 'onEditEntityRefsDeclClick',
      'click .add-js': 'onAddJSClick',
      'click .add-css': 'onAddCSSClick',
      'click .add-dtd': 'onAddDTDClick'
    },
    buttons: [
      {cls: "btn-default", text: 'Close', event: 'onClose'},
      {cls: "btn-primary", text: 'Update', event: 'onUpdate'},
    ],
    render: function() {
      ModalView.prototype.render.apply(this, arguments);
      this.$('.modal-title').text(this.model.get('name'));
      return this;
    },
    onUpdate: function() {
      var data = {};
      _.each([
        'name', 'abbr', 'long_name', 'font', 'description'
      ], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      return this.model.save(data).done(_.bind(function() {
        this.$('.error').addClass('hide');
      }, this)).fail(_.bind(function(resp) {
        this.$('.error').removeClass('hide').html(resp.responseText);
      }, this));
    },
    onEditDocRefsDeclClick: function(){
      var view = new EditDocRefsDeclView({
        community: this.model, onBack: _.bind(this.render, this)
      });
      return view.render();
    },
    onEditEntityRefsDeclClick: function(){
      var view = new EditEntityRefsDeclView({
        community: this.model, onBack: _.bind(this.render, this)
      });
      return view.render();
    },
    onAddTextFileClick: function() {
      (new TEIUploadView({
        model: this.model, onBack: _.bind(this.render, this) 
      })).render();
    },
    onAddImageZipClick: function() {
      (new ImageZipUploadView({
        model: this.model, onBack:  _.bind(this.render, this)
      })).render();
    },
    onGetDocXMLClick: function() {
      (new GetDocXMLView({
        model: this.model, onBack: _.bind(this.render, this)
      })).render();
    },
    onRenameDocClick: function() {
      (new RenameDocView({
        model: this.model, onBack: _.bind(this.render, this)
      })).render();
    },
    onDeleteDocClick: function() {
      (new DeleteDocView({
        model: this.model, onBack: _.bind(this.render, this)
      })).render();
    },
    onDeleteDocTextClick: function() {
      (new DeleteDocTextView({
        model: this.model, onBack: _.bind(this.render, this)
      })).render();
    },
    onAddJSClick: function() {
      (new JSUploadView({
        model: this.model, onBack: _.bind(this.render, this)
      })).render();
    },
    onAddCSSClick: function() {
      (new CSSUploadView({
        model: this.model, onBack: _.bind(this.render, this)
      })).render();
    },
    onAddDTDClick: function() {
      (new DTDUploadView({
        model: this.model, onBack: _.bind(this.render, this)
      })).render();
    }
  });
  return EditCommunityView;
});
