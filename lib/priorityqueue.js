
var Queue = require('./queue');

var console = process.console;

var PriorityQueue = Queue.extend({
  constructor: function ctor(opts) {

    if (typeof opts.score === 'undefined') {
      throw new Error('score function not specified!');
    }

    if (typeof opts === 'string') {
      opts = {
        name: opts
      };
    }

    this.name = opts.name;
    opts.filename = this.filename = opts.filename || this.name + '.priority';

    this.super(opts);

    this.score = opts.score;
    this._sortSettings = {_q_priority: -1, _q_index: 1};
  },
  peek: function peek() {

    return this.super().then(function (item) {
      if (typeof item !== 'undefined') {
        delete item._q_priority;
      }
      return item;
    }, function (err) {
      throw new Error(err);
    });
  },
  enqueue: function enqueue(item) {
    
    // Score the priority, if applicable.
    item._q_priority = this.score(item);

    var promise = this.super(item);
    
    delete item._q_priority;
    
    return promise;
  },
  dequeue: function dequeue() {

    return this.super().then(function (item) {
      if (typeof item !== 'undefined') {
        delete item._q_priority;
      }
      return item;
    }, function (err) {
      throw new Error(err);
    });
  }
});

module.exports = PriorityQueue;