var io = require('socket.io'),
	webserver = require('./simple-server.js');

var initFunc = function(){},
	queueFunc = function(){},
	computeFunc = null,
	storeFunc = null,
	completeFunc = function(){};
	
	
module.exports = {
	configure: function(options) {
		initFunc = options.init || initFunc;
		queueFunc = options.queue || queueFunc;
		computeFunc = options.compute;
		storeFunc = options.store;
		completeFunc = options.complete || completeFunc;
	},
	listen: function(port) {
		if(computeFunc && storeFunc) {			
			webserver.start(port, 'Grid Server');
		} else {
			var errMessage = 'Required Configurations: ';
			if(!storeFunc) {
				
				if(!computeFunc) {
					errMessage += 'compute, ';
				}
				
				errMessage += 'store';
			} else {			
				if(!computeFunc) {
					errMessage += 'compute';
				}
			}
			
			console.error('Failed to start Grid Server -> ' + errMessage );
		}
	}
}



