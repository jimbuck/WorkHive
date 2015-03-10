var fs = require('fs');

var _ = require('lodash');

var Queue = require('./../lib/queue');
var PriorityQueue = require('./../lib/priorityqueue');

// Delete old queues to reset tests...
if (fs.existsSync('people1.queue')) {
  fs.unlinkSync('people1.queue');
}

if (fs.existsSync('people2.score')) {
  fs.unlinkSync('people2.score');
}

function Person(opts) {
  this.first = opts.first;
  this.last = opts.last;
}

var person1 = new Person({first: 'One', last: 'A'});
var person2 = new Person({first: 'Two', last: 'B'});
var person3 = new Person({first: 'Three', last: 'C'});
var person4 = new Person({first: 'Four', last: 'D'});

var standardQueue = new Queue({
  name: 'people1',
  type: Person
});

standardQueue.enqueue(person1)
  .then(function () {
    return standardQueue.enqueue(person2);
  }).then(function () {
    return standardQueue.enqueue(person3);
  }).then(function () {
    return standardQueue.enqueue(person4);
  }).then(function () {
    return standardQueue.dequeue()
      .then(function (person) {
        console.assert(_.isEqual(person, person1), '[STD] DEQUEUE: Not Person 1!');
      });
  }).then(function () {
    return standardQueue.peek()
      .then(function (person) {
        console.assert(_.isEqual(person, person2), '[STD] PEEK: Not Person 2!');
      });
  })
  .then(function () {
    return standardQueue.dequeue()
      .then(function (person) {
        console.assert(_.isEqual(person, person2), '[STD] DEQUEUE: Not Person 2!');
      });

  }).then(function () {
    return standardQueue.dequeue()
      .then(function (person) {
        console.assert(_.isEqual(person, person3), '[STD] DEQUEUE: Not Person 3!');
      });
  }).then(function () {
    return standardQueue.peek()
      .then(function (person) {
        console.assert(_.isEqual(person, person4), '[STD] PEEK: Not Person 4!');
      });
  }).then(function () {
    return standardQueue.dequeue()
      .then(function (person) {
        if (person) {
          console.assert(_.isEqual(person, person4), '[STD] DEQUEUE: Not Person 4!');
        }
      });
  });

console.log('`Queue` tests completed!');

var priorityQueue = new PriorityQueue({
  name: 'people2',
  type: Person,
  score: function (person) {
    return person.last.charCodeAt(0);
  }
});

priorityQueue.enqueue(person3)
  .then(function () {
    return priorityQueue.enqueue(person4);
  }).then(function () {
    return priorityQueue.enqueue(person1);
  }).then(function () {
    return priorityQueue.enqueue(person2);
  }).then(function () {
    return priorityQueue.dequeue()
      .then(function (person) {
        console.assert(_.isEqual(person, person4), '[PRI] DEQUEUE: Not Person 4!');
      });
  }).then(function () {
    return priorityQueue.peek()
      .then(function (person) {
        console.assert(_.isEqual(person, person3), '[PRI] PEEK: Not Person 3!');
      });
  })
  .then(function () {
    return priorityQueue.dequeue()
      .then(function (person) {
        console.assert(_.isEqual(person, person3), '[PRI] DEQUEUE: Not Person 3!');
      });

  }).then(function () {
    return priorityQueue.dequeue()
      .then(function (person) {
        console.assert(_.isEqual(person, person2), '[PRI] DEQUEUE: Not Person 2!');
      });
  }).then(function () {
    return priorityQueue.peek()
      .then(function (person) {
        console.assert(_.isEqual(person, person1), '[PRI] PEEK: Not Person 1!');
      });
  }).then(function () {
    return priorityQueue.dequeue()
      .then(function (person) {
        if (person) {
          console.assert(_.isEqual(person, person1), '[PRI] DEQUEUE: Not Person 1!');
        }
      });
  });

console.log('`PriorityQueue` tests completed!');