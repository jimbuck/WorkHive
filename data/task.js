
var Class = require('igneousjs/class');

var console = process.console;

var Task = Class.extend({
  constructor: function(opts) {
    opts = opts || {};
    
    if(typeof opts.action !== 'function'){
      throw new Error('No `action` specified!');
    }

    //this._id = opts._id;
    this.action = opts.action;
    this.createdDate = opts.createdDate || new Date();
    this.completedDate = opts.completedDate;
    this.data = opts.data || {};
    this.result = opts.result;
  }
});

module.exports = Task;