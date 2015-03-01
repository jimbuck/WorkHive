
var _ = require('lodash');
var Promise = require('bluebird');
var DataStore = require('nedb');
var Class = require('igneousjs/class');

var QUEUE_EXTENSION = '.queue';

var Queue = Class.extend({
  constructor: function ctor(name, priority){
    this.name = name;
    this.priority = priority;
    
    // Change the sort settings if this is a priority queue.
    this._sortSettings = (typeof this.priority !== 'undefined') 
      ? {_q_priority: -1, _q_index: 1}
      : {_q_index: 1};

    var dbOptions = {
      filename: './' + name + QUEUE_EXTENSION,
      autoload: true
    };
    
    // Create the private db context.
    this._db = new DataStore(dbOptions);
  },
  peek: function peek(){
    var _this = this;
    
    return new Promise(function(resolve, reject){
      _this._db.find({}).sort(_this._sortSettings).limit(1).exec(function (err, items) {
        if (err) {
          reject(err);
        } else {
          var item = items[0];

          delete item._id;
          delete item._q_priority;
          delete item._q_index;
          
          resolve(item);
        }
      });
    });
  },
  enqueue: function enqueue(item){
    var _this = this;

    return new Promise(function(resolve, reject){
      // Delete the id if it has it.
      delete item._id;

      // Set the timestamp.
      item._q_index = parseInt((+new Date())+''+process.hrtime()[1]);
      
      // Score the priority, if applicable.
      if (typeof _this.priority !== 'undefined')
        item._q_priority = _this.priority(item);

      _this._db.insert(item, function (err) {
        if (err) {
          reject(err);
        } else {
          delete item._id;
          delete item._q_priority;
          delete item._q_index;
          
          resolve(item);
        }
      });
    });
  },
  dequeue: function dequeue(){
    var _this = this;
    
    return new Promise(function(resolve, reject){
      _this._db.find({}).sort(_this._sortSettings).limit(1).exec(function (findErr, items) {
        
        // Error during find...
        if(findErr){
          reject(findErr);
          return;
        }
        
        // No items in queue...
        if (!items || items.length === 0) {
          resolve(undefined);
          return;
        }

        var item = items[0];
        _this._db.remove({_id: item._id}, {}, function (removeErr, numRemoved) {
          if (removeErr) {
            reject(removeErr);
          } else {
            delete item._id;
            delete item._q_priority;
            delete item._q_index;

            resolve(item);
          }
        });
      });
    });
  },
  compact: function(){
    this._db.persistence.compactDatafile();
  }
});

module.exports = Queue;
