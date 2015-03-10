
var _ = require('lodash');
var Promise = require('bluebird');
var DataStore = require('nedb');
var Class = require('igneousjs/class');

var console = process.console;

var Queue = Class.extend({
  constructor: function ctor(opts) {
    if (typeof opts === 'string') {
      opts = {
        name: opts
      };
    }

    this.name = opts.name;
    this.filename = opts.filename || this.name + '.queue';
    
    if (opts.type) {
      this.type = opts.type;
      this.cast = function (data) {
        return new this.type(data);
      };
    }
    
    // Sort by queue index only.
    this._sortSettings = {_q_index: 1};

    var dbOptions = {
      filename: this.filename,
      autoload: true
    };

    // Create the private db context.
    this._db = new DataStore(dbOptions);
  },
  peek: function peek() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      _this._db.find({}).sort(_this._sortSettings).limit(1).exec(function (err, items) {
        if (err) {
          reject(err);
        } else {
          var item = items[0];

          delete item._id;
          delete item._q_index;

          resolve(_this.cast(item));
        }
      });
    });
  },
  enqueue: function enqueue(item) {
    var _this = this;
    
    var originalItem = item;    
    item = _.clone(item);

    return new Promise(function (resolve, reject) {
      // Delete the id if it has it.
      delete item._id;

      // Set the timestamp.
      item._q_index = parseInt((+new Date()) + '' + process.hrtime()[1]);

      _this._db.insert(item, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(originalItem);
        }
      });
    });
  },
  dequeue: function dequeue() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      _this._db.find({}).sort(_this._sortSettings).limit(1).exec(function (findErr, items) {

        // Error during find...
        if (findErr) {
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
            delete item._q_index;

            resolve(_this.cast(item));
          }
        });
      });
    });
  }
});

module.exports = Queue;
