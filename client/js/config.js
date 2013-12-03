var require = {
  paths: {
    jquery: [
      '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
      '../lib/jquery/jquery'
    ],
    backbone: '../lib/backbone-amd/backbone',
    underscore: '../lib/underscore-amd/underscore',
    text: '../lib/requirejs-text/text',
    async: '../lib/requirejs-plugins/src/async',
    json: '../lib/requirejs-plugins/src/json',
    urijs: '../lib/uri.js/src',
    bootstrap: '../lib/bootstrap/dist/js/bootstrap',
    'bootstrap-fileupload': 
      '../lib/bootstrap-jasny/docs/assets/js/bootstrap-fileupload',
    codemirror: '../lib/codemirror/lib/codemirror',
    'jquery.cookie': '../lib/jquery.cookie/jquery.cookie',
    'jquery-ui': '../lib/jquery-ui/ui/jquery-ui',
    'codemirror-xml': '../lib/codemirror/mode/xml/xml',
    'dynatree': '../lib/dynatree/dist/jquery.dynatree.min',
    tmpl: '../tmpl'
  },
  shim: {
    bootstrap: ['jquery'],
    'bootstrap-fileupload': ['bootstrap'],
    'jquery.cookie': ['jquery'],
    codemirror: {exports: 'CodeMirror'},
    'jquery-ui': {deps: ['jquery']},
    dynatree: ['jquery-ui'],
    'codemirror-xml': ['codemirror']
  }
  , urlArgs: 'bust=' + (new Date()).getTime()
};
