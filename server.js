var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {

    console.log('request starting...');
     
	var url_parts = url.parse(request.url, true);

    var filePath = '.' + url_parts.pathname;
    if (filePath == './')
        filePath = './index.html';
         
    var extname = path.extname(filePath);
    var contentTypes = {
		'.html': "text/html",
		'.js':   "text/javascript",
		'.css': 'text/css',
		'.xml': 'text/xml',
		'.png': 'image/png',
		'.gif': 'image/gif'
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
     
}).listen(8080);
 
console.log('Server running at http://127.0.0.1:8080/');