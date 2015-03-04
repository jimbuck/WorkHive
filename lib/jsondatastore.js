
var fs = require('fs');
var path = require('path');

var Class = require('igneousjs/class');

var readWriteOptions = {
  encoding: 'utf8'
};

function saveData(filepath, data) {
  var dir = path.dirname(filepath);

  if (!fs.existsSync(dir)) {
    mkdirp.mkdirpSync(dir)
  }
  
  fs.writeFileSync(filepath, JSON.stringify(data), readWriteOptions);
}

var JsonDataStore = Class.extend({
  constructor: function (opts) {
    if (typeof opts === 'string') {
      opts = {
        path: opts
      };
    }

    opts = opts || {};

    if (typeof opts.path === 'undefined') {
      throw new Error('Path must be specified for a JsonRepository!');
    }

    this.path = opts.path;
    this.defaults = opts.defaults || {};
  },
  createIfMissing: function () {
    if (!fs.existsSync(this.path)) {
      saveData(this.path, this.defaults);
    }
  },
  get: function (key) {

    this.createIfMissing();

    var data = JSON.parse(fs.readFileSync(this.path, readWriteOptions));

    if (typeof key === 'undefined') {
      return data;
    } else {
      return data[key];
    }
  },
  set: function (key, value) {
    if (typeof key === 'undefined') {
      throw new Error('Null Argument Exception: key');
    }

    this.createIfMissing();

    if (typeof key === 'object' && typeof value === 'undefined') {
      saveData(this.path, key);
      return;
    }

    var data = this.get();

    data[key] = value;

    saveData(this.path, data);
  },
  'delete': function (key) {
    if (typeof key === 'undefined') {
      throw new Error('Null Argument Exception: key');
    }

    this.createIfMissing();

    var data = this.get();

    delete data[key];

    saveData(this.path, data);
  }
});

module.exports = JsonDataStore;