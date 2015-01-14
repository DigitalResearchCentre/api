var LIB = '../lib/'

var require = {
  paths: {
    jquery: [
      '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
      LIB + 'jquery/jquery.min'
    ],
    backbone: LIB + 'backbone-amd/backbone-min',
    underscore: LIB + 'underscore-amd/underscore-min',
    text: LIB + 'requirejs-text/text',
    async: LIB + 'requirejs-plugins/src/async',
    json: LIB + 'requirejs-plugins/src/json',
    urijs: LIB + 'uri.js/src',
    bootstrap: LIB + 'bootstrap/dist/js/bootstrap.min',
    'bootstrap-fileupload': 
      LIB + 'bootstrap-jasny/docs/assets/js/bootstrap-fileupload',
    codemirror: LIB + 'codemirror/lib/codemirror',
    'jquery.cookie': LIB + 'jquery.cookie/jquery.cookie',
    'jquery-ui': LIB + 'jquery-ui/ui/minified/jquery-ui.min',
    'codemirror-xml': LIB + 'codemirror/mode/xml/xml',
    'dynatree': LIB + 'dynatree/dist/jquery.dynatree.min',
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
  , waitSeconds: 0
  , urlArgs: 'bust=' + ((new Date()).getTime() % (3600*24*7))
};
