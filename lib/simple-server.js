var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	path = require('path');


module.exports = {
	start: function(port, serverName) {
		port = port || 80;
		serverName = serverName || 'Web Server';
		
		http.createServer(function (request, response) {
			console.log('request starting...');
			 
			var filePath = '.' + url.parse(request.url, true).pathname;
			if (filePath == './') filePath = './index.html';
			
			var extname = path.extname(filePath);
			var contentTypes = {
				'.html': "text/html",
				'.js':   "text/javascript",
				'.css': 'text/css',
				'.xml': 'text/xml'
			};
			
			var contentType = contentTypes[extname] || 'text/plain';
			 
			path.exists(filePath, function(exists) {
				if (exists) {
					fs.readFile(filePath, function(error, content) {
						if (error) {
							response.writeHead(500);
							response.end();
						}
						else {
							response.writeHead(200, { 'Content-Type': contentType });
							response.end(content, 'utf-8');
						}
					});
				}
				else {
					response.writeHead(404);
					response.end();
				}
			});
		}).listen(port);
		console.log(serverName + ' running at http://localhost:'+port+'/');
	}
}