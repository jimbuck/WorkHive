'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var JsonDataStore = require('./lib/jsondatastore');

var configuration = new JsonDataStore({
  path:'./config.json',
  pretty: true,
  defaults:{
    port: 6014,
    logLevel: null // 'combined', 'common', 'short', 'dev', 'tiny'
  }
});

var config = configuration.get();

// all environments
if(config.logLevel) {
  app.use(morgan(config.logLevel));
}
app.set('port', config.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(favicon('./public/favicon.ico'));
app.use('/', serveStatic('./public'));

// development only
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

require('./routes')(app);
require('./sockets')(io);

http.listen(app.get('port'), function () {
  console.log('WorkHive server listening on port ' + app.get('port'));
});