
var http = require('http')
var port = 8080

var lactate = require('lactate')

var pages = lactate.dir('pages')

var files = lactate.dir('files', {
    public:'files'
    //cache:true,
    //expires:'one day'
})

var server = http.createServer(function(req, res) {
    var url = req.url
    if (url === '/') {
        return pages.serve('index.html', req, res)
    }else if (/^\/files/.test(url)) {
        return files.serve(req, res)
    }else {
        res.writeHead(404)
        res.end()
    }
})

server.listen(port, function() {
    console.log('Listening on port', port)
})

