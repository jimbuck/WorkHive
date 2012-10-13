
/*
 * As zlib's functions are necessarily
 * asynchronous, I have pre-gzipped
 * all of the files and included them
 * in ./files directory.
 */

var fs  = require('fs')
var map = module.exports

var dir = __dirname + '/../files/'

var files = [
    'nodejs.jpeg',
    'font-awesome.css.gz',
    'jquery.min.js.gz'
].forEach(function(file) {
    var fileName = file.replace(/\.gz$/, '');
    var file = fs.readFileSync(dir+file)
    map[fileName] = file.toString()
})

return map
