
// MIT License
// 
// Copyright 2012 Brandon Wilson
// 
// Permission is hereby granted, free of charge, to any person 
// obtaining a copy of this software and associated documentation 
// files (the "Software"), to deal in the Software without 
// restriction, including without limitation the rights to use, 
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software
// is furnished to do so, subject to the following conditions: 
// 
// The above copyright notice and this permission notice shall be 
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.


var fs       = require('fs')
  , path     = require('path')
  , zlib     = require('zlib')
  , mime     = require('mime')
  , Suckle   = require('suckle')
  , abridge  = require('abridge')
  , fraction = require('fraction')
  , expire   = require('expire')
  , cache    = require('./cache')
  , dir      = require('./directory')
  , log      = require('./logger').http;


function Lactate(options) { 

  this.opts = {
      root:               process.cwd()
    , from:               ''
    , subdirs:            true
    , not_found:          false

    //Caching options
    , cache:             {}
    , watch_files:       true
    , max_age:           86400 * 2

    //Response options
    , headers:           {}
    , gzip:              true
    , minify:            false

    //Directory options
    , bundle:            false
    , rebundle:          true

    , debug:             false
  };

  this.cache = new(cache);
  if (!!options) this.set(options);

};

Lactate.prototype.serve = function(fp, req, res, status) {
  var opts = this.opts;
  var filePath = opts.root;
  var notFound;

  // Discern request path relative
  // to root and public options
   
  if (typeof(fp) === 'string') {
    // First argument is relative
    // file path, join it to the
    // root path

    filePath = path.join(filePath, fp)
  }else {
    // First argument is request
    // object, discern the path.

    res = req; req = fp

    var from = opts.from || '';
    var pubLen = from.length;
    var url = req.url;
    var dirname = path
      .dirname(url)
      .substring(1);

    // If the requested directory
    // does not match the public
    // directory option, test
    // that subdirectories are
    // enabled and that the req-
    // uest path is appropriate.

    notFound = this._404.bind(this, url, req, res);

    if (dirname !== from) {
      if (!opts.subdirs) return notFound();
      var subdir = dirname.substring(0, pubLen);
      if (subdir !== from) return notFound();
    };

    url = url.substring(pubLen+1);
    filePath = path.join(filePath, url);
  };

  notFound = this._404.bind(this, filePath, req, res);

  // Check cache for request path

  var mtime, cached = this.getCache(filePath);

  if (cached) {
    // File is cached, get mtime
    // for freshness check

    mtime = cached.headers['Last-Modified'];
  }else {
    // File is not cached. Check
    // That the file exists and
    // if so capture its mtime
    // and watch the file for
    // modifications.

    try {
      var stat = fs.statSync(filePath);
      if (!stat.isFile())
        return notFound();

      mtime = stat.mtime.toUTCString();
      this.watch(filePath);
    }catch(exception) {
      return notFound();
    };
  };

  // Get if-modified-since header to
  // test freshness of cached file

  var ims = !!req ? req.headers['if-modified-since'] : null;

  if (opts.max_age && ims === mtime) {
    // The client has fresh file,
    // send a 304 'not modified'
    // response without data.
    
    this._304(filePath, req, res);
  }else if (!!cached) {
    // Client does not have file,
    // but the file has been
    // cached in memory from a
    // previous request.
    //
    // Stream the cached file in
    // segments if its length 
    // exceeds 200k
    // 
    // If we are serving a page
    // as a 404 handler, we will
    // serve a pre-cached file.

    if (!status || status === 200) {
      this._200(filePath, 'Cached', req, res, cached.headers);
    }else {
      res.writeHead(status, cached.headers);
    };

    var data = cached.read();
    var max_size = this.cache.segment_threshold;

    if (data.length < max_size) {
      res.end(data);
    }else {
      var stream = fraction.createStream(data);
      stream.on('error', console.error);
      stream.pipe(res);
    };
  }else {
    // File is requested for
    // the first time. Set
    // appropriate response
    // headers, read file,
    // gzip it, stream it
    // to the client, and
    // cache it for future
    // requests.

    this.complete(filePath, mtime, req, res, status)
  };
};

Lactate.prototype.watch = function(filePath) {
  var cache = this.opts.cache;
  if (!cache || !this.opts.watch_file)
    return;

  var watchFile = function(fp, ev) {
    if (ev === 'change')
      cache[fp] = null;
  }.bind(this, filePath);

  fs.watch(filePath, watchFile);
};

Lactate.prototype.complete = function(filePath, mtime, req, res, status) {
  // Detect file type for
  // content-type header,
  // set appropriate headers
  // for client-side caching.

  var mimeType = mime.lookup(filePath);
  var maxAge = this.opts.max_age;
  var cacheControl = (maxAge
    ? 'public, max-age=' + maxAge
    : 'no-store, no-cache')
    + ', must-revalidate';

  var pow = 'Lactate';
  var vary = 'Accept-Encoding';

  var headers = { 
    'X-Powered-By':   pow,
    'Content-Type':   mimeType,
    'Last-Modified':  mtime,
    'Cache-Control':  cacheControl,
    'Vary':           vary
  };

  // Extend response headers
  // with `headers` option.

  var optHeaders = this.opts.headers;
  var keys = Object.keys(optHeaders);
  keys.forEach(function(header) {
    var item = optHeaders[header];

    switch(typeof(item)) {
      case 'function':
        headers[header] = item(req);
        break;
      case 'string':
        case 'number':
        headers[header] = item;
        break;
    };
  });

  this.send(filePath, headers, req, res, status);
};

Lactate.prototype.send = function(filePath, headers, req, res, is404) {
  var mux = new Suckle();

  if (!!this.opts.cache) {
    // Stream with callback is
    // supplied data such that
    // in-memory cache can be set

    var completed = function(data, len) {
      headers['Content-Length'] = len;
      this.setCache(filePath, data, headers);
    }.bind(this);

    mux.oncomplete(completed);
  };

  if (!!res) mux.pipe(res);

  // On file open, write
  // appropriate response
  // headers before streaming
  // file data

  var open = function(fd) {
    if (is404) {
      res.writeHead(404, headers);
    }else {
      this._200(filePath, 'Serving', req, res, headers, null);
    };
  }.bind(this);

  var error = this._404.bind(this, filePath, req, res);

  // Open file readstream, 
  // attach open and error 
  // listeners

  var rs = fs.createReadStream(filePath);
  rs.on('open', open);
  rs.on('error', error);

  // Detect content-type for
  // automatic minification
  // of text files, if enabled

  var cType = headers['Content-Type'];
  var isText = /^(text|application)/.test(cType);

  // File is not text, pipe it
  // directly to the response

  if (!isText)
    return rs.pipe(mux);

  var cmpr = this.opts.minify 
  && /gzip/.test(req.headers['Accept-Encoding']||'')
  && /\.js|css$/.test(filePath);

  var rStream = cmpr ? abridge.minify(rs) : rs;

  // Gzip is disabled, pipe 
  // minified text file to
  // the response

  if (!this.opts.gzip)
    return rStream.pipe(mux);

  // Gzip is enabled, pipe 
  // minifier to gzip, then
  // to the response

  headers['Content-Encoding'] = 'gzip';

  var gzip = zlib.createGzip();
  gzip.pipe(mux);
  rStream.pipe(gzip);
};

Lactate.prototype.setCache = function(filePath, data, headers) {
  if (!!this.opts.cache) {
    this.cache.set(filePath, headers, data);
  };
};

Lactate.prototype.getCache = function(filePath) {
  var cache = this.opts.cache;
  return !!cache ? this.cache.get(filePath) : null;
};

Lactate.prototype._200 = function(filePath, msg, req, res, headers, data) {
  var status = 200;
  res.writeHead(status, headers)
  if (data) res.end(data);
  this.debug(status, msg, filePath);
};

Lactate.prototype._304 = function(filePath, req, res) {
  var status = 304;
  res.writeHead(status);
  res.end();
  this.debug(status, 'Not modified', filePath);
};

Lactate.prototype._404 = function(filePath, req, res) {
  var handler = this.opts.not_found;
  var status  = 404;

  this.debug(status, 'Not found', filePath);

  switch(typeof(handler)) {
    case 'function':
      handler(req, res);
      break;
    case 'string':
      this.serve(handler, null, res, status);
      break;
    default:
      var page = path.resolve(__dirname + '/../public/404.html');
      var now = new Date().toUTCString();
      this.complete(page, now, req, res, status);
      break;
  };
};

Lactate.prototype.set = function(k, v) {
  if (typeof(k) === 'object') {
    for (var opt in k)
      this.set(opt, k[opt]);
    return;
  };

  var opts = this.opts;

  if (!opts.hasOwnProperty(k)) 
    return;

  if (k === 'max_age' && typeof(v) === 'string') {
    v = expire.getSeconds(v);
  } else if (k === 'root') {
    v = path.resolve(v);
  } else if (k === 'from') {
    v = !v ? '' : path.join(v, '.');
  } else if (k === 'cache' && !!v) {
    var cache_opts = (typeof(v) === 'object') ? v : {};
    this.cache = new cache(cache_opts);
    v = true;
  };

  opts[k] = v;
};

Lactate.prototype.get = function(k) {
  return this.opts[k];
};

Lactate.prototype.header = 
Lactate.prototype.headers = 
Lactate.prototype.setHeader = function(key, val) {
  var headers = this.opts.headers;
  if (typeof(key) === 'object') {
    for (k in key) {
      headers[k] = key[k];
    };
  }else {
    headers[key] = val;
  };
};

Lactate.prototype.max_age = 
Lactate.prototype.maxAge = function(val) {
  this.set('max_age', val);
};

Lactate.prototype.notFound = function(val) {
  this.set('not_found', val);
};

Lactate.prototype.debug = function(status, msg, filePath) {
  if (this.opts.debug) {
    console.log(log[status](msg), filePath);
  };
};

module.exports.Lactate = function(options) {
  return new Lactate(options);
}

module.exports.file = function(path, req, res, options) {
  var lactate = new Lactate(options);
  return lactate.serve(path, req, res);
};

module.exports.dir = function(directory, options) {
  if (typeof directory === 'string') {
    options = options || {};
    options.root = directory;
  }else {
    options = directory || {};
    options.root = options.root || process.cwd();
  };

  var lactate = dir.call(new Lactate(options));

  var bundle = lactate.get('bundle');
  switch(typeof(bundle)) {
    case 'boolean':
      if (!bundle) break;
      lactate.bundleScripts(bundle);
      lactate.bundleStyles(bundle);
      break;
    case 'string':
      lactate.bundle.call(lactate, bundle);
      break;
  };

  return lactate;
};

// Drop-in replacement for 
// Express.static
module.exports.static = function(dir, pub, options) {
  options = options || {};

  switch(typeof(pub)) {
    case 'string':
      options.pub = pub;
      break;
    case 'object':
      options = pub;
      break;
  };

  var lactate = module.exports.dir(dir, options);
  return lactate.toMiddleware();
};

// Adaptors for node-static API
module.exports.serveFile = module.exports.file;
module.exports.Server    = module.exports.dir;
