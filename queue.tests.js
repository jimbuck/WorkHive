
var _ = require('lodash');

var Queue = require('./lib/queue.js');

var person1 = {first: 'One', last: 'A'};
var person2 = {first: 'Two', last: 'B'};
var person3 = {first: 'Three', last: 'C'};
var person4 = {first: 'Four', last: 'D'};

var simpleQueue = new Queue('people');

simpleQueue.enqueue(person1)
  .then(function () {
    return simpleQueue.enqueue(person2);
  }).then(function () {
    return simpleQueue.enqueue(person3);
  }).then(function () {
    return simpleQueue.enqueue(person4);
  }).then(function () {
    return simpleQueue.dequeue()
      .then(function (person) {
        console.assert(_.isEqual(person,person1), 'DEQUEUE: Not Person 1!');
      });
  }).then(function () {
    return simpleQueue.peek()
      .then(function (person) {
        console.assert(_.isEqual(person, person2), 'PEEK: Not Person 2!');
      });
  })
  .then(function () {
    return simpleQueue.dequeue()
      .then(function (person) {
        console.assert(_.isEqual(person, person2), 'DEQUEUE: Not Person 2!');
      });
    
  }).then(function () {
    return simpleQueue.dequeue()
      .then(function (person) {
        console.assert(_.isEqual(person, person3), 'DEQUEUE: Not Person 3!');
      });
  }).then(function () {
    return simpleQueue.peek()
      .then(function (person) {
        console.assert(_.isEqual(person, person4), 'PEEK: Not Person 4!');
      });
  }).then(function () {
    return simpleQueue.dequeue()
      .then(function (person) {
        if (person) {
          console.assert(_.isEqual(person, person4), 'DEQUEUE: Not Person 4!');
        }
      });
  });