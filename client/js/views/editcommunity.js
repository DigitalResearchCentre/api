define([
  'jquery', 'underscore', 'urls', 'auth',
  './modal', './editdocrefsdecl', './editentityrefsdecl', './fileupload', 
  './members', './invite', 'text!tmpl/communityedit.html'
], function(
  $, _, urls, auth,
  ModalView, EditDocRefsDeclView, EditEntityRefsDeclView, 
  FileUploadView, MembersView, InviteView, tmpl
) {
  var mediaURL = urls.mediaURL;

  var TEIUploadView = FileUploadView.extend({
    getTmplData: function() {
      return {name: 'xml'};
    },
    getUrl: function() {
      return urls.get(['community:upload-tei', {community: this.model.id}]);
    }
  });

  var FileListWithDefaultUploadView = FileUploadView.extend({
    render: function() {
      FileUploadView.prototype.render.apply(this, arguments);
      var name = this.getName()
        , $ul = $('<ul></ul>')
        , defaults = this.getDefault()
      ;
      this.$('.file-list').before('<label>Default:</label>');
      this.$('.file-list').before($ul);
      this.$('.file-list').before('<label>Current:</label>');
      if (defaults.isFetched()){
        defaults.each(function(file) {
          $ul.append('<li>' + file.get(name) + '</li>');
        });
      }else{
        defaults.fetch().done(function() {
          defaults.each(function(file) {
            var url = mediaURL + file.get(name);
            $ul.append(
              '<li data-pk="' + file.id + '">' + 
              '<a target="_blank" href="' + url + '">' + file.get(name) +
              '</a></li>');
          });
        });
      }
      return this;
    }
  });

  var JSUploadView = FileListWithDefaultUploadView.extend({
    getFileList: function() {
      return this.model.getJS();
    },
    getUrl: function() {
      return urls.get(['community:upload-js', {community: this.model.id}]);
    },
    getName: function() {
      return 'js';
    },
    getDefault: function() {
      return this.model.getDefaultJS();
    }
  });

  var CSSUploadView = FileListWithDefaultUploadView.extend({
    getName: function() {
      return 'css';
    },
    getUrl: function() {
      return urls.get(['community:upload-css', {community: this.model.id}]);
    },
    getFileList: function() {
      return this.model.getCSS();
    },
    getDefault: function() {
      return this.model.getDefaultCSS();
    }
  });

  var DTDUploadView = FileListWithDefaultUploadView.extend({
    getName: function() {
      return 'schema';
    },
    getUrl: function() {
      return urls.get(['community:upload-dtd', {community: this.model.id}]);
    },
    getFileList: function() {
      return this.model.getDTD();
    },
    getDefault: function() {
      return this.model.getDefaultDTD();
    }
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
        error: function(resp) {
          that.$('.error').removeClass('hide').html(resp.responseText);
        }
      }).done(_.bind(function() {
        this.$('.alert-success').removeClass('hide').show();
        this.$('.error').addClass('hide');
      }, this)).fail(_.bind(function(resp) {
        this.$('.alert-success').hide();
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
      return _.template(tmpl)();
    },
    events: {
      'click .add-text-file': 'onAddTextFileClick',
      'click .btn.add-image-zip': 'onAddImageZipClick',
      'click .get-doc-xml': 'onGetDocXMLClick',
      'click .rename-doc': 'onRenameDocClick',
      'click .delete-doc': 'onDeleteDocClick',
      'click .delete-doc-text': 'onDeleteDocTextClick',
      'click .edit-doc-refsdecl': 'onEditDocRefsDeclClick',
      'click .edit-entity-refsdecl': 'onEditEntityRefsDeclClick',
      'click .add-js': 'onAddJSClick',
      'click .add-css': 'onAddCSSClick',
      'click .add-dtd': 'onAddDTDClick',
      'click .btn.members': 'onMembersClick',
      'click .invite': 'onInviteClick'
    },
    buttons: [
      {cls: "btn-default", text: 'Close', event: 'onClose'},
      {cls: "btn-danger", text: 'Delete', event: 'onDeleteClick'},
      {cls: "btn-primary", text: 'Update', event: 'onUpdate'},
    ],
    initialize: function () {
        this.listenTo(this.model, 'change', this.onChange);
        this._subViewCache = {};
    },
    render: function() {
        ModalView.prototype.render.apply(this, arguments);
        this.$('.modal-title').text(this.model.get('name'));
        this.onChange();
        return this;
    },
    onChange: function () {
        var model = this.model;
        _.each([
            'name', 'abbr', 'long_name', 'font', 'description'
        ], function(name) {
            this.$('#form-field-'+name).val(model.get(name));
        }, this);
    },
    onUpdate: function() {
      var data = {};
      _.each([
        'name', 'abbr', 'long_name', 'font', 'description'
      ], function(name) {
        data[name] = this.$('#form-field-'+name).val();
      }, this);
      return this.model.save(data).done(_.bind(function() {
        var $alert = this.$('.alert-success').removeClass('hide').show();
        this.$('.error').addClass('hide');
        _.delay(function() {$alert.hide(1000);}, 2000);
      }, this)).fail(_.bind(function(resp) {
        this.$('.error').removeClass('hide').html(resp.responseText);
      }, this));
    },
    openSubView: function (key, cls, kwargs) {
        if (!kwargs) {
            kwargs = {model: this.model, onBack: _.bind(this.render, this)};
        }
        if (!this._subViewCache[key]) {
            this._subViewCache[key] = new cls(kwargs);
        }
        return this._subViewCache[key].render();
    },
    onEditDocRefsDeclClick: function(){
        return this.openSubView('EditDocRefsDecl', EditDocRefsDeclView, {
            community: this.model, onBack: _.bind(this.render, this)
        });
    },
    onEditEntityRefsDeclClick: function(){
        return this.openSubView('EditEntityRefsDecl', EditEntityRefsDeclView, {
            community: this.model, onBack: _.bind(this.render, this)
        });
    },
    onAddTextFileClick: function() {
        return this.openSubView('TEIUpload', TEIUploadView);
    },
    onAddImageZipClick: function() {
        return this.openSubView('ImageZipUpload', ImageZipUploadView);
    },
    onGetDocXMLClick: function() {
        return this.openSubView('GetDocXML', GetDocXMLView);
    },
    onRenameDocClick: function() {
        return this.openSubView('RenameDoc', RenameDocView);
    },
    onDeleteDocClick: function() {
        return this.openSubView('DeleteDoc', DeleteDocView);
    },
    onDeleteDocTextClick: function() {
        return this.openSubView('DeleteDocText', DeleteDocTextView);
    },
    onAddJSClick: function() {
        return this.openSubView('JSUpload', JSUploadView);
    },
    onAddCSSClick: function() {
        return this.openSubView('CSSUpload', CSSUploadView);
    },
    onAddDTDClick: function() {
        return this.openSubView('DTDUpload', DTDUploadView);
    },
    onDeleteClick: function() {
      var that = this;
      return this.model.destroy().done(_.bind(function() {
        var $alert = this.$('.alert-success').removeClass('hide').show();
        this.$('.error').addClass('hide');
        auth.getUser().getMemberships().fetch();
        _.delay(function() {
          $alert.hide(1000);
          that.onClose();
        }, 500);
      }, this)).fail(_.bind(function(resp) {
        this.$('.error').removeClass('hide').html(resp.responseText);
      }, this));
    },
    onMembersClick: function() {
        return this.openSubView('Members', MembersView);
    },
    onInviteClick: function() {
        return this.openSubView('Invite', InviteView);
    }
  });
  return EditCommunityView;
});
