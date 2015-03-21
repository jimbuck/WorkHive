
var Class = require('igneousjs/class');

var console = process.console;

var Task = Class.extend({
  constructor: function(opts) {
    opts = opts || {};
    
    if(typeof opts.action !== 'function'){
      throw new Error('No `action` specified!');
    }
    
    this.problem = opts.problem; // name of the problem
    this.action = opts.action;
    this.createdDate = opts.createdDate || new Date();
    this.completedDate = opts.completedDate;
    this.args = opts.args || {};
    this.result = opts.result;
  }
});

module.exports = Task;