
/**
 * Module dependencies.
 */

var program = require('commander')
  , mkdirp = require('mkdirp')
  , pkg = require('../package.json')
  , version = pkg.version
  , os = require('os')
  , fs = require('fs');

// CLI

program
  .version(version)
  .usage('[options] [dir]')
  .option('-s, --single', 'create the scripts in a single file')
  .option('-f, --force', 'force on non-empty directory')
  .option('-u, --username', 'username for admin')
  .option('-p, --password', 'password for admin')
  .parse(process.argv);

// Name

var path = program.args.shift() || '.';

// end-of-line code

var eol = os.EOL

/**
 * Config file template.
 */

var configTemplate = [
    'module.exports = {'
  , '    compute: function (input, done) {'
  , '        // Write the work code here and simply use the'
  , '        // async-friendly "done" function to return the result.'
  , '        done({/* result */});'
  , '    },'
  , '    nextDataSet: function(done) {'
  , ''
  , '        // Write the input generation code here and simply use the'
  , '        // async-friendly "done" function to return the input dataset.'
  , '        done({/* input */});'
  , ''
  , '    },'
  , '    validate: function(result, done) {'
  , ''
  , '        // Verify the result data and use the'
  , '        // async-friendly "done" function to return true or false.'
  , '        done({/* input */});'
  , ''
  , '    },'
  , '}'
].join(eol);

/**
 * Jade layout template.
 */

var jadeLayout = [
    'doctype 5'
  , 'html'
  , '  head'
  , '    title= title'
  , '    link(rel=\'stylesheet\', href=\'/style.css\')'
  , '  body'
  , '    block content'
].join(eol);

/**
 * Client index template.
 */

var jadeClient = [
    'extends layout'
  , ''
  , 'block content'
  , '  h1= title'
  , '  p Thanks for contributing to #{title}!'
].join(eol);

/**
 * Admin index template.
 */

var jadeAdmin = [
    'extends layout'
  , ''
  , 'block content'
  , '  h1= Admin'
  , '  p Edit settings here!'
].join(eol);

// Generate application

(function createApplication(p) {
  emptyDirectory(p, function(empty){
    if (empty || program.force) {
      createApplicationAt(p);
    } else {
      program.confirm(p + ' is not empty, continue? ', function(ok){
        if (ok) {
          process.stdin.destroy();
          createApplicationAt(p);
        } else {
          abort('aborting');
        }
      });
    }
  });
})(path);

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */

function createApplicationAt(path) {
  console.log();
  process.on('exit', function(){
    console.log();
    console.log('   install dependencies:');
    console.log('     $ cd %s && npm install', path);
    console.log();
    console.log('   run the app:');
    console.log('     $ node app');
    console.log();
  });

  mkdir(path, function(){
    write(path + '/config.js', configTemplate);
    write(path + '/client.css', '');
    write(path + '/client.js', '');
    mkdir(path + '/views', function(){
        write(path + '/views/layout.jade', jadeLayout);
        write(path + '/views/client.jade', jadeClient);
        write(path + '/views/admin.jade', jadeAdmin);
    });

    // package.json
    var pkg = {
        name: 'grid-app'
      , version: '0.0.1'
      , private: true
      , scripts: { start: 'node server.js' }
      , dependencies: { 'node-at-home': ''+version }
    }

    write(path + '/package.json', JSON.stringify(pkg, null, 2));
  });
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory(path, fn) {
  fs.readdir(path, function(err, files){
    if (err && 'ENOENT' != err.code) throw err;
    fn(!files || !files.length);
  });
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str) {
  fs.writeFile(path, str);
  console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
  mkdirp(path, 0755, function(err){
    if (err) throw err;
    console.log('   \033[36mcreate\033[0m : ' + path);
    fn && fn();
  });
}

/**
 * Exit with the given `str`.
 *
 * @param {String} str
 */

function abort(str) {
  console.error(str);
  process.exit(1);
}
