
var Class = require('igneousjs/class');

var Task = Class.extend({
  constructor: function(opts) {
    opts = opts || {};
    
    if(typeof opts.action !== 'function'){
      throw new Error('No `action` specified!');
    }
    
    this.action = opts.action;
    this.createdDate = opts.createdDate || new Date();
    this.completedDate = opts.completedDate;
    this.data = opts.data || {};
    this.results = opts.results || [];
  }
});

module.exports = Task;