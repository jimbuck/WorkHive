
var Class = require('igneousjs/class');

var Problem = Class.extend({
  constructor: function(opts){
    
    opts = opts || {};
    
    this.name = opts.name;
    this.generate = opts.generate;
    this.compute = opts.compute;
    this.verify = opts.verify;
    this.minCompute = opts.minCompute || 1;
    this.minVerify = opts.minVerify || 1;
    
    //this.report = opts.report || function(data){return data;};
    
    // Validate the `name` property.
    if(typeof this.name === 'undefined') {
      throw new Error('Problem must have a `name` property!');
    }

    // Validate the `generate` property.
    if (typeof this.generate === 'undefined') {
      throw new Error('Problem must have a `generate` function!');
    }

    // Validate the `compute` property.
    if (typeof this.compute === 'undefined') {
      throw new Error('Problem must have a `compute` function!');
    }

    // Validate the `verify` property.
    if (typeof this.verify === 'undefined') {
      throw new Error('Problem must have a `verify` function!');
    }
    
    // Convert the `compute` function to a string.
    if(typeof this.compute !== 'string') {
      this.compute = this.compute.toString();
    }

    // Convert the `verify` function to a string.
    if (typeof this.verify !== 'string') {
      this.verify = this.verify.toString();
    }
  }
});

module.exports = Problem;