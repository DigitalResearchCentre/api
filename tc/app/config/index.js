var _ = require('lodash');

console.log(process.env.TC_ENV);
module.exports = _.assign({}, require('./' + process.env.TC_ENV));
