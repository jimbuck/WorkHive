'use strict';

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var scribe = require('scribe-js')();
var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var JsonDataStore = require('./lib/jsondatastore');

var configuration = new JsonDataStore({
  path:'./config.json',
  pretty: true,
  defaults:{
    port: 6014
  }
});

var config = configuration.get();

app.set('port', config.port);
app.use(scribe.express.logger());
app.use('/logs', scribe.webPanel());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(favicon('./public/favicon.ico'));
app.use('/', serveStatic('./public'));

// development only
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

var console = process.console;

require('./routes')(app);
require('./sockets')(io);

server.listen(app.get('port'), function () {
  console.log('WorkHive server listening on port ' + app.get('port'));
});