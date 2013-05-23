var require = {
  paths: {
    jquery: '../lib/jquery-1.9.1',
    jqueryui: '../lib/jquery-ui/js/jquery-ui-1.10.1.custom',
    underscore: '../lib/underscore',
    backbone: '../lib/backbone',
    text: '../lib/text'
  },
  shim: {
    jqueryui: ['jquery'],
    underscore: {exports: '_'},
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    }
  }
  , urlArgs: 'bust=' + (new Date).getTime()
};


