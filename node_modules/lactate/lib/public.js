
// Create fallback Not Found page

var path = require('path');
var fs = require('fs');

var version = require(__dirname + '/../package.json').version;
var publicPath = path.resolve(__dirname + '/../public');
var _404Path = path.join(publicPath, '404.html');

var _404 = ''
+ '<html>'
+ '<head>'
+ '<meta charset=\'utf-8\'/>'
+ '<title>404 Not Found</title>'
+ '<style>'
+ '* { color:#444; font-family:sans-serif; }'
+ '#center { width:50%; margin:100px auto; text-align:center; }'
+ '</style>'
+ '</head>'
+ '<body>'
+ '<div id=\'center\'>'
+ '<h1>Not Found</h1>'
+ '<hr/>'
+ '<p>Lactate/{{version}}</p>'
+ '</div>'
+ '</body>'
+ '</html>'

_404 = _404.replace('{{version}}', version);
fs.writeFileSync(_404Path, _404);
