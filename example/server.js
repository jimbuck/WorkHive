var grid = require('./lib/node-at-home.js');

var computeFunc = require('./collatz-compute.js'),
	storeFunc = require('./collatz-store.js');


grid.configure({
	compute: computeFunc,
	store: storFunc
});

grid.listen('8080');