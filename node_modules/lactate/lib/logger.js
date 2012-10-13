
var TERM_COLORS = {
    clear:          '0',

    brightgreen:    '1;32',
    brightcyan:     '1;36',
    brightred:      '1;31',
    brightblue:     '1;34',
    brightmagenta:  '1;35',
    brightyello:    '1;33',
    white:          '1;37',

    green:          '0;32',
    cyan:           '0;36',
    red:            '0;31',
    blue:           '0;34',
    magenta:        '0;35',
    yellow:         '0;33',
    gray:           '0;37'
};

var PREFIX = '\u001b[';
var SUFFIX = 'm';

var getColor = module.exports.getColor = function(_color) {
    var _text = ([]).slice.call(arguments, 1).join(' ');
    var clear = [PREFIX, SUFFIX].join(TERM_COLORS.clear);
    var color = [PREFIX, SUFFIX].join(TERM_COLORS[_color] || 0);
    return [color, clear].join(_text);
};

Object.keys(TERM_COLORS).slice(1).forEach(function(color) {
    module.exports[color] = function() {
        console.log(getColor.apply(this, arguments));
    };
});

module.exports.indent = function(text) {
    var indStr = '';
    var times = 1;
    if (typeof n === 'number') {
        times = n;
    }else {
        text = n;
    };
    for (;n;n--) {
        indStr += '  ';
    };

    return text.split('\n').map(function(i) {
        return indStr + i;
    }).join('\n');
};

module.exports.Logger = function(options) {
    options.info  = options.info || 'green';
    options.warn  = options.warn || 'yellow';
    options.error = options.error || 'red';

    var self = {};

    Object.keys(options).forEach(function(i) {
        self[i] = function(color, text) {
            console.log(getColor.apply(this, arguments));
        }.bind(this, options[i]);
    });

    return self;
};

module.exports.http = (function() {
    var Logger = require('./logger');

    var _msg = Logger.getColor.bind(Logger, 'gray');
    var _200 = Logger.getColor('green', '200');
    var _304 = Logger.getColor('yellow', '304');
    var _404 = Logger.getColor('red', '404');

    return {
        200:function(msg) {
            return [_200, _msg(msg)].join(' ');
        },
        304:function(msg) {
            return [_304, _msg(msg)].join(' ');
        },
        404:function(msg) {
            return [_404, _msg(msg)].join(' ');
        }
    };
})();
