var stdio = require('stdio')
  , env = process.env
  , ops
;

ops = stdio.getopt({
  env: {args: 1, description: 'ex. dev, prod, test'}
});

env.TC_ENV = (ops.env || env.TC_ENV || 'dev');

require('./app/app');


