/**
 * Database
 */

var Promise = require('bluebird');
var DataStore = require('nedb');
var Class = require('igneousjs/class');

var Problem = require('./problem');
var Result = require('./result');

var console = process.console;

var Database = Class.extend({
  constructor: function(opts){
    
    opts = opts || {};
    
    // Set the database file name.
    opts.filename = opts.filename || 'problems.db';
    
    // Ensure that the database loads immediately.
    opts.autoload = true;
    
    this._db = new DataStore(opts);
  },
  addProblem: function(prob){    
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
  allProblems: function(){
    return new Promise(function (resolve, reject) {
      this._db.find({}, function (err, probs) {
        if (err) {
          reject(err);
        } else {
          
          for(var i = 0, prob; prob = probs[i++];){
            probs[i] = new Problem(prob);
          }

          resolve(probs);
        }
      });
    });
  },
  getProblemById: function(id){
    return new Promise(function (resolve, reject) {
      this._db.findOne({_id: id}, function(err, prob){
        if(err){
          reject(err);
        } else {
          prob = new Problem(prob);
          
          resolve(prob);
        }
      });
    });
  },
  getProblemByName: function (name) {
    return new Promise(function (resolve, reject) {
      this._db.findOne({name: name}, function (err, prob) {
        if (err) {
          reject(err);
        } else {
          prob = new Problem(prob);

          resolve(prob);
        }
      });
    });
  },
  updateProblem: function(prob){
    return new Promise(function (resolve, reject) {
      this._db.update({_id: prob._id}, prob, {}, function(err, numReplaced, newItem){
        if(err){
          reject(err);
        } else {
          newItem = new Problem(newItem);
          resolve(newItem);
        }
      });
    });
  },
  deleteProblem: function(id){
    return new Promise(function (resolve, reject) {
      this._db.remove({_id: id}, function(err, numRemoved){
        if(err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    });
  },
  getResults: function(probName){
    return this.getProblemByName(probName).then(function (prob) {
      return prob.results.map(function(r){ return new Result(r); });
    });
  },
  addResult: function(probName, result){
    return this.getProblemByName(probName).then(function(prob){
      prob.result.push(result);
      return this.updateProblem(prob);
    });
  }
});

module.exports = Database;