var route = require('router')(),
	http = require('http');
	//webserver = require('./simple-server.js');

	
var defaults = {
	initFunc: function(){},
	queueFunc: function(){},
	computeFunc: null,
	storeFunc: null,
	completeFunc: function(){},
	delay: 0
}

module.exports = {
	configure: function(options) {
		defaults = extend(options, defaults);
	},
	listen: function(port) {
		var errMessage = '';
		for(var o in defaults) {
			if(!defaults[o]) {
				errMessage += o + ', ';
			}
		}
		
		if(errMessage) {
			console.error('Failed to start Grid Server -> Required Configurations' + errMessage );
		} else {
			webserver.start(port, defaults);
		}
	}
}

function extend(obj, base) {
    var copy = {};
    for (var o in base) {
        copy[o] = base[o];
    }
    for (var o in obj) {
        copy[o] = obj[o];
    }
    return copy;
}



