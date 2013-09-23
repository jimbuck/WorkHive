
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

// Path

var path = program.args.shift() || '.';

// end-of-line code

var eol = os.EOL

// Template engine

program.template = 'jade';

/**
 * Routes index template.
 */

var index = [
    ''
  , '/*'
  , ' * GET home page.'
  , ' */'
  , ''
  , 'exports.index = function(req, res){'
  , '  res.render(\'index\', { title: \'Express\' });'
  , '};'
].join(eol);

/**
 * Routes users template.
 */

var users = [
    ''
  , '/*'
  , ' * GET users listing.'
  , ' */'
  , ''
  , 'exports.list = function(req, res){'
  , '  res.send("respond with a resource");'
  , '};'
].join(eol);

/**
 * Jade layout template.
 */

var jadeLayout = [
    'doctype 5'
  , 'html'
  , '  head'
  , '    title= title'
  , '    link(rel=\'stylesheet\', href=\'/stylesheets/style.css\')'
  , '  body'
  , '    block content'
].join(eol);

/**
 * Jade index template.
 */

var jadeIndex = [
    'extends layout'
  , ''
  , 'block content'
  , '  h1= title'
  , '  p Welcome to #{title}'
].join(eol);

// Generate application

(function createApplication(path) {
  emptyDirectory(path, function(empty){
    if (empty || program.force) {
      createApplicationAt(path);
    } else {
      program.confirm('destination is not empty, continue? ', function(ok){
        if (ok) {
          process.stdin.destroy();
          createApplicationAt(path);
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
    mkdir(path + '/public');
    mkdir(path + '/public/javascripts');
    mkdir(path + '/public/images');
    mkdir(path + '/public/stylesheets', function(){
      switch (program.css) {
        case 'less':
          write(path + '/public/stylesheets/style.less', less);
          break;
        case 'stylus':
          write(path + '/public/stylesheets/style.styl', stylus);
          break;
        default:
          write(path + '/public/stylesheets/style.css', css);
      }
    });

    mkdir(path + '/routes', function(){
      write(path + '/routes/index.js', index);
      write(path + '/routes/user.js', users);
    });

    mkdir(path + '/views', function(){
      switch (program.template) {
        case 'ejs':
          write(path + '/views/index.ejs', ejsIndex);
          break;
        case 'jade':
          write(path + '/views/layout.jade', jadeLayout);
          write(path + '/views/index.jade', jadeIndex);
          break;
        case 'jshtml':
          write(path + '/views/layout.jshtml', jshtmlLayout);
          write(path + '/views/index.jshtml', jshtmlIndex);
          break;
        case 'hjs':
          write(path + '/views/index.hjs', hoganIndex);
          break;

      }
    });

    // CSS Engine support
    switch (program.css) {
      case 'less':
        app = app.replace('{css}', eol + 'app.use(require(\'less-middleware\')({ src: __dirname + \'/public\' }));');
        break;
      case 'stylus':
        app = app.replace('{css}', eol + 'app.use(require(\'stylus\').middleware(__dirname + \'/public\'));');
        break;
      default:
        app = app.replace('{css}', '');
    }

    // Session support
    app = app.replace('{sess}', program.sessions
      ? eol + 'app.use(express.cookieParser(\'your secret here\'));' + eol + 'app.use(express.session());'
      : '');

    // Template support
    app = app.replace(':TEMPLATE', program.template);

    // package.json
    var pkg = {
        name: 'application-name'
      , version: '0.0.1'
      , private: true
      , scripts: { start: 'node app.js' }
      , dependencies: {
        express: version
      }
    }

    if (program.template) pkg.dependencies[program.template] = '*';

    // CSS Engine support
    switch (program.css) {
      case 'less':
        pkg.dependencies['less-middleware'] = '*';
        break;
      default:
        if (program.css) {
          pkg.dependencies[program.css] = '*';
        }
    }

    write(path + '/package.json', JSON.stringify(pkg, null, 2));
    write(path + '/app.js', app);
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
