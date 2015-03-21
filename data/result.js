var Class = require('igneousjs/class');

var console = process.console;

var Result = Class.extend({
  constructor: function (opts) {
    opts = opts || {};
    
    this.args = opts.args;
    this.value = opts.value;
    this.createdDate = opts.createdDate || new Date();
  }
});

module.exports = Result;