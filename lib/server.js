var gridServer = require('./grid-server.js');
var _ = require('underscore');

var noop = function(){};
var nullop = function(){ return null; };

var defaults = {
	init : noop,
	queue : nullop,
	compute : nullop,
	complete : noop,
	error : noop
}

module.exports = {
	createGrid : function (options) {
		
    options = _.extend(defaults, options);

		return {
			listen : function (port) {
				port = port || 8080;
        gridServer.start(port, options);
			}

		}

	}
}
