
var Class = require('igneousjs/class');

var console = process.console;

var Problem = Class.extend({
  constructor: function(opts){
    
    opts = opts || {};
    
    this._id = opts._id;
    this.name = opts.name;
    this.seed = opts.seed;
    this.compute = opts.compute;
    this.results = opts.results || [];
    
    // Validate the `name` property.
    if(typeof this.name === 'undefined') {
      throw new Error('Problem must have a `name` property!');
    }

    // Validate the `seed` method.
    if (typeof this.seed === 'undefined') {
      throw new Error('Problem must have a `seed` function!');
    }

    // Validate the `compute` property.
    if (typeof this.compute === 'undefined') {
      throw new Error('Problem must have a `compute` function!');
    }
    
    // Ensure the `compute` property is the correct type.
    if(typeof this.compute !== 'string' || typeof this.compute !== 'function'){
      throw new Error('Problem\'s `compute` must be a function or stringified function!');
    }
    
    // Convert the `compute` function to a string.
    if(typeof this.compute === 'function') {
      this.compute = this.compute.toString();
    }
  }
});

module.exports = Problem;