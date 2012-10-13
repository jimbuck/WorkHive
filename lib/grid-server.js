var http = require('http'),
	files = require('lactate').dir('../content'),
	route = require('router')(),
	socketIO = require('socket.io');

module.exports = {
	start: function(port, options) {
		var app = null;
		port = port || 80;
		
		// Static Routes ***********************************************
		
		// Index, starts comuting...
		route.get('/', function(req,res) {
			files.serve('index.html', req, res);
		});
		
		// Display current stats
		route.get('/stats', function(req,res) {
			files.serve('stats.html', req, res);
		});
		
		// Benchmark tests
		route.get('/test', function(req,res) {
			files.serve('test.html', req, res);
		});
		
		app = http.createServer(route);
		
		// Socket.IO ***************************************************
		var io = socketIO.listen(app);
		io.sockets.on('connection', function (socket) {
			socket.emit('compute', {
				func: options.computeFunc,
				data: options.queueFunc.NextSet()
			});
			
		    socket.on('solve', function (data) {
			    options.storeFunc(data);
				console.log(data);
		    });
		});
		
		app.listen(port);
		console.log('Grid Server running at http://localhost:'+port+'/');
	}
}