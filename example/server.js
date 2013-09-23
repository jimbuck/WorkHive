var nodeAtHome = require('../lib/node-at-home.js');

var computeFunc = require('./collatz-compute.js');


var grid = nodeAtHome.createGrid({
  compute: computeFunc
});

grid.listen();