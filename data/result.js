var Class = require('igneousjs/class');

var console = process.console;

var Result = Class.extend({
  constructor: function (opts) {
    opts = opts || {};

    if (!opts.problem) {
      throw new Error('No `problem` specified!');
    }

    if (typeof opts.problem === 'undefined') {
      throw new Error('No `value` specified! (null is allowed, but not undefined)');
    }
    
    this.problem = opts.problem;
    this.createdDate = opts.createdDate || new Date();
    this.value = opts.value;
    this.verified = opts.verified || false;
  }
});

module.exports = Result;