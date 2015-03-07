
var Promise = require('bluebird');
var DataStore = require('nedb');
var Class = require('igneousjs/class');

var Problems = Class.extend({
  constructor: function(){
    
    var opts = {
      filename: 'problems.db',
      autoload: true
    };
    
    this._db = new DataStore(opts);
  },
  add: function(prob){    
    return new Promise(function (resolve, reject) {
      if(!prob.name) {
        throw new Error('Problem must have a name!');
      }
      
      prob._id = prob.name;
      
      this._db.insert(prob, function(err){
        if (err) {
          reject(err);
        } else {
          resolve(prob);
        }
      });
    });
  },
  all: function(){
    return new Promise(function (resolve, reject) {
      this._db.find({}, function (err, probs) {
        if (err) {
          reject(err);
        } else {
          resolve(probs);
        }
      });
    });
  },
  get: function(id){
    return new Promise(function (resolve, reject) {
      this._db.findOne({_id: id}, function(err, prob){
        if(err){
          reject(err);
        } else {
          resolve(prob);
        }
      });
    });
  },
  update: function(prob){
    return new Promise(function (resolve, reject) {
      this._db.update({_id: prob._id}, prob, {}, function(err, numReplaced, newItem){
        if(err){
          reject(err);
        } else {
          resolve(newItem);
        }
      });
    });
  },
  'delete': function(id){
    return new Promise(function (resolve, reject) {
      this._db.remove({_id: id}, function(err, numRemoved){
        if(err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    });
  }
});

module.exports = Problems;