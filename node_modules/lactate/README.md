# Lactate

`npm install -g lactate`

An exceedingly fast static file handler, with a few electives.

### Features

* In-memory caching
* Robust cache-control setting
* Automatic gzipping
* Automatic minification
* Custom 404 pages
* Custom response headers
* Middleware export
* Asset bundling

### Comparison

Lactate caches files in memory without hitting the file system for each request, watches files for efficient udpates, and streams gzipped files directly to the response.  [Preliminary benchmarks](https://github.com/Weltschmerz/Lactate/blob/master/benchmark/new/results.md) show that Lactate has a significant advantage over  most worthy competitors on the [node modules wiki](https://github.com/joyent/node/wiki/Modules#wiki-web-frameworks-static)

![Bench](http://i.imgur.com/b3xJU.jpg)

* `ab -c 100 -n 10000`
* `node` v0.8.7
* `jquery.min.js` ~100kb

*See /benchmark for details*

## Using Lactate

### Global executable

If installed globally with `npm install -g lactate`, you will have the `lactate` command at your disposal. This will run lactate static file server in the current working directory, utilizing the `cluster` module for multiple CPU cores. All [options](https://github.com/Weltschmerz/Lactate#options) are available.

```code
wltsmrz@home:~$ lactate --help
Usage: lactate [options]

Options:
--from, -f                        Public path                   [default: ""]
--cache, -c                       Store assets in-memory        [default: true]
--watch_files, --watch-files, -w  Watch files for cache update  [default: true]
--subdirs, -s                     Serve subdirectories          [default: true]
--max_age, --max-age, -M          Client-side caching max-age   [default: 172800]
--gzip, -g                        Gzip text assets              [default: true]
--minify, -m                      Minify text assets            [default: false]
--bundle, -b                      Bundle text assets            [default: false]
--rebundle, -r                    Rebundle assets if modified   [default: true]
--headers, -H                     Custom response headers       [default: ""]
--debug, -d                       Log HTTP info                 [default: true]
--quiet, -q                       Prevent all log output        [default: false]
```

### Programmatic lactating

Lactate can be used with either plain node, or with Express. With Express, Lactate is a drop-in replacement for `static` middleware, but with far more ability. The examples below use Express 2.x API for simplicity. See the [examples](https://github.com/Weltschmerz/Lactate/tree/master/example) for various examples.

```js
var lactate = require('lactate');
var express = require('express');

var app = express.createServer();
app.use(lactate.static(__dirname + '/files'));
```

## Testing Lactate

If installed locally (without -g flag to npm install):

1. `cd` into `~/node_modules/lactate`
2. `npm install ./` to install devDependencies
3. `make test` to run mocha test

If installed globally, simply run `npm test lactate`.

##The varieties of Lactate experience

In the general case, the `Lactate` method returns an object with the methods `serve` `set` and `get`, importantly. However, there are more convenient methods exported by Lactate. They follow.

###Serving individual files

To serve an individual file, use the `file` method.

```js

  app.get('/', function(req, res) {
    Lactate.file('land.html', req, res)
  })
```

An optional fourth argument is for Lactate settings.

```js
  var options = {
    max_age:'two days',
    minify:true,
    from:'scripts'
  }

  app.get('/', function(req, res) {
    Lactate.file('land.html', req, res, options);
  })
```

###Serving directories

The `dir` method allows you to namespace a directory, for convenience.

```js
var images = Lactate.dir('images');

app.get('/images/:image', function(req, res) {
  images.serve(req.params.image, req, res)
})
```

Pass a second argument to `dir` for options:

```js
var options = { cache:false };
var images = Lactate.dir('assets/images', options);
images.maxAge('five days');
```

###Middleware export

For maximum convenience, you may use the `toMiddleware` method on directories.

```js
var images = Lactate.dir('images', {
  from:'images',
  cache:false,
  max_age:'two years',
  debug:true
}).toMiddleware()

app.use(images) //That's it!
```

You may also pass additional options to the `toMiddleware` function.

```js
var images = Lactate.dir('images');
images.set('cache', false);

var middleware = images.toMiddleware({
  from:'images'
})

app.use(middleware)
```

###Custom 404 pages

Use the `not_found` option for defining custom 404 pages or handler functions.

Strings will be treated as ordinary file paths, and as such will abide rules for gzipping and in-memory caching. Note that `notFound` paths will be relative to the `root` setting (by default `process.cwd()`).

```js
var lactate = Lactate.Lactate({
    not_found:'pages/404.html'
})

lactate.set('not_found', 'pages/not_found.html');
```

Functions allow you to fully customize your 404 handling.

```js
var lactate = Lactate.Lactate({
  not_found:function(req, res) { }
});
```

A special configuration method is provided:

```js
lactate.notFound(function(req, res) {
    res.writeHead(404)
    res.end('My custom 404 thingy')
})
```

###Custom response headers

Extend response headers with `headers` option.

```js
var options = {
    headers: {
        server:'Lactate'
    }
};

lactate.set(options);
lactate.set('headers', options.headers);
lactate.headers(options.headers);
lactate.setHeader('server', options.headers.server);

app.get('/', function(req, res) {
    lactate.serve('pages/land.html', req, res);
});
```

You may also use a function for dynamic header setting:

```js
  lactate.setHeader('server', function(req, res) {
    return 'lactate';
  });
```

###Bundling assets for request optimization

Lactate directories have an additional method for combining and minifying text assets, to reduce the number of necessary requests.

```js
var assets = lactate.dir('assets', {
    from:'assets',
    minify:true
});

assets.bundle('js', 'common.js', function(err, data) { });
//assets.bundleJS('common.js', function(){});
assets.bundleCSS('common.css');
app.use(assets.toMiddleware());
```

Now, requesting `/assets/common.js` will result with a combined and minified (and by default gzipped) script of all the scripts contained in that directory. This function does actually write the bundled files to disk.

More on this later

##Options

Options can be passed to the initialization function or using the `set` method.

### Setting options

```js

//Passing to initialization function
var lactate = require('lactate').Lactate({
  max_age:'two days'
})

//Set method
lactate.set('max_age', null)

//Either function accepts (key, value) or an object.

```

### Options available

+ `root` **string**

Local directory from which to serve files. By default, the current working directory.

+ `from` **string**

Public directory exposed to clients. If set, only requests from /*directory* will complete. Contrast this with the `root` option which is the location of files on the serving machine, not necessarily the requested path.

+ `subdirs` **boolean**

By default subdirectories are served. To disable this, set `subdirs` to false.

+ `cache` **boolean**

Keep files in-memory. Enabled by default, and no great reason to disable, unless you are serving fairly large files or run a low-traffic operation.

+ `gzip` **boolean**

If false, disables automatic gzipping for text files (HTML, JS, CSS). Enabled by default.

+ `minify` **boolean**

If true, will automatically minify JavaScript and CSS using [Abridge](https://github.com/Weltschmerz/Abridge). Disabled by default.

+ `watch_files` **boolean**

Determines whether Lactate will watch files to update its cache. If this is disabled, then your file cache will not update automatically as files are modified on the server.

+ `headers` **object** or **string** or **function**

Sets custom response headers. If the option value is a function, it is a callback which is give (req, res) arguments. This function should return the header value; it is a mapping function.

+ `max_age` **number** or **string**

Pass this function a number (of seconds) or a string and appropriate headers will be set for client-side caching. Lactate comes with expiration defaults, such as 'two days' or '5 years and sixteen days' See [Expire](https://github.com/Weltschmerz/Expire) for details.

```js
lactate.set('max_age', 87500)
//87500 seconds
lactate.set('max_age', 'two days')
//172800 seconds
lactate.set'max_age', 'five weeks and one minute and ten seconds')
//3024070 seconds
lactate.set('max_age', 'one year and 2 months and seven weeks and 16 seconds')
//41050028 seconds
```

+ `not_found` **string** or **function**

For custom 404 handling. Functions are supplied the response for 100% custom response handling. Otherwise, if set to a string, this option will be treated as an ordinary file path and abide rules for gzipping / in-memory cache.

+ `debug` **boolean**

Colored status / msg / path logging, for debugging purposes.

###Special options methods

Lactate has some special methods to reduce visual clutter:

```js
lactate.maxAge('two days');
```

is equivalent to:

```js
lactate.set('max_age', 'two days');
```

Similarly, the `headers` method is for setting custom response headers.

## License

MIT License

Copyright 2012 Brandon Wilson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
