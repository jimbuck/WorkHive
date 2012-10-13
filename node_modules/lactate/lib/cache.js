
var fs = require('fs');

module.exports = Cache;

function Cache(options) {
  options = options || {};
  this.segment_threshold = options.segment_threshold || 1024 * 200;
  this.expire = options.expire || (1000 * 900);
};

Cache.prototype.cache = Object.create(null);


Cache.prototype.set = function(filePath, headers, data) {
  var item = new CacheItem(headers, data);
  this.cache[filePath] = item;

  var remove = function() {
    this.cache[filePath] = null;
  }.bind(this);

  setTimeout(remove, this.expire);
};

Cache.prototype.get = function(filePath) {
  return this.cache[filePath];
};

function CacheItem(headers, data) {
 this.headers = headers;
 this.data = data;
 this.time = new Date().toUTCString();
};

CacheItem.prototype.read = function() {
  return this.data;  
};

