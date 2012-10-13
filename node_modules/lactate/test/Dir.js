
var should = require('should')
var Lactate = require('../lib/lactate')

var http = require('./utils/http_utils')
var files = require('./utils/get_files')

var DIR = __dirname + '/files/'

describe('Dir', function() {
  afterEach(function(done) {
    http.stopServer(done)
  })
  describe('#serve(jquery.min.js)', function() {
    it('Should not err', function(done) {
      var dir = Lactate.dir(DIR)
      http.server(function(req, res) {
        dir.serve('jquery.min.js', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        done()
      })
    })
    it('Should have status 200', function(done) {
      var dir = Lactate.dir(DIR)
      http.server(function(req, res) {
        dir.serve('jquery.min.js', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        res.should.have.status(200)
        done()
      })
    })
    it('Should have appropriate content-type header', function(done) {
      var dir = Lactate.dir(DIR)
      http.server(function(req, res) {
        dir.serve('jquery.min.js', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        res.headers.should.have.property('content-type')
        res.headers['content-type'].should.equal('application/javascript')
        done()
      })
    })
    it('Should serve complete data', function(done) {
      var dir = Lactate.dir(DIR)
      http.server(function(req, res) {
        dir.serve('jquery.min.js', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        data.should.equal(files['jquery.min.js'])
        done()
      })
    })
  })
  describe('#serve()', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.dir(DIR)
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client('/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        done()
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.dir(DIR)
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client('/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        res.should.have.status(200)
        done()
      })
    })
    it('Should have appropriate content-type header', function(done) {
      var lactate = Lactate.dir(DIR)
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client('/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        res.headers.should.have.property('content-type')
        res.headers['content-type'].should.equal('application/javascript')
        done()
      })
    })
    it('Should serve complete data', function(done) {
      var lactate = Lactate.dir(DIR)
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client('/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        data.should.equal(files['jquery.min.js'])
        done()
      })
    })
  })
  describe('#serve() with public dir', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.dir(DIR, {
        from:'files'
      })
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client('/files/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        done()
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.dir(DIR, {
        from:'files'
      })
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client('/files/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        res.should.have.status(200)
        done()
      })
    })
    it('Should have appropriate content-type header', function(done) {
      var lactate = Lactate.dir(DIR, {
        from:'files'
      })
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client('/files/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        res.headers.should.have.property('content-type')
        res.headers['content-type'].should.equal('application/javascript')
        done()
      })
    })
    it('Should serve complete data', function(done) {
      var lactate = Lactate.dir(DIR, {
        from:'files'
      })
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client('/files/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        data.should.equal(files['jquery.min.js'])
        done()
      })
    })
  })
  describe('#toMiddleware()', function() {
    it('Should not err', function(done) {
      var middleware = Lactate.dir(DIR).toMiddleware()
      http.server(middleware)
      http.client('/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        done()
      })
    })
    it('Should have status 200', function(done) {
      var middleware = Lactate.dir(DIR).toMiddleware()
      http.server(middleware)
      http.client('/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        res.should.have.status(200)
        done()
      })
    })
    it('Should have appropriate content-type header', function(done) {
      var middleware = Lactate.dir(DIR).toMiddleware()
      http.server(middleware)
      http.client('/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        res.headers.should.have.property('content-type')
        res.headers['content-type'].should.equal('application/javascript')
        done()
      })
    })
    it('Should serve complete data', function(done) {
      var middleware = Lactate.dir(DIR).toMiddleware()
      http.server(middleware)
      http.client('/jquery.min.js', function(err, res, data) {
        if (err) { return done(err) }
        data.should.equal(files['jquery.min.js'])
        done()
      })
    })
  })
})

