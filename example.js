var grid = require('./lib/node-at-home.js');


grid.configure({
	compute: function(data) {
		var steps = Collatz(data.input);
		
		return steps;
		
		function Collatz(num, step) {
			if(!step && step !== 0) step = 0;
			
			if(num==1) {
				return step;
			} else {
				step++;
				if(num % 2 == 0) {
					return Collatz(num/2, step);
				} else {
					return Collatz(3*num + 1, step);
				}
			}
		}
	}
	// ,
	// store: function(data) {
		// var num = data.input,
			// steps = data.result;
			
		// // Handle...
	// }
});

grid.listen('8080');