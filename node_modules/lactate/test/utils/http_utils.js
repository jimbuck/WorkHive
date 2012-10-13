
var Suckle = require('suckle')
var http = require('http')
var port = 7279
var _server = null

module.exports.stopServer = function(cb) {
  if (_server) {
    _server.close(cb);
  }else {
    cb();
  };
};

module.exports.server = function(cb) {
  _server = new http.Server();
  _server.addListener('request', cb);
  _server.listen(port);
};

module.exports.client = function(path, cb, times) {
  times = times || 1;

  var options = {
    host:'localhost',
    port:port,
    path:path,
    method:'GET',
    headers:{}
  };

  var cacheHeaders = [ 
    'last-modified',
    'cache-control'
  ];

  var hasCacheHeaders = function(headers) {
    return cacheHeaders.every(function(header) {
      return !!headers[header];
    });
  };

  ;(function next(i) {
    var req = http.request(options, function(res) {
      var headers = res.headers;
      if (hasCacheHeaders(headers)) {
        var lm = headers['last-modified'];
        options.headers['if-modified-since'] = lm;
      };

      var suckle = new Suckle(function(data) {
        ++i;
        if (i === times) {
          cb(null, res, data.toString());
        }else {
          next(i);
        };
      })

      res.pipe(suckle);
      res.on('error', cb);
    });
    req.end();
  })(0);
};
