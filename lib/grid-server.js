
var express = require('express');
var http = require('http');
var path = require('path');

var _ = require('underscore');
var resourceful = require('resourceful');

resourceful.use('memory');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes.js')(app);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log("Node@home server listening on port " + app.get('port'));
});

io.sockets.on('connection', require('./sockets.js'));