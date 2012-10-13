
var should = require('should')
var Lactate = require('../lib/lactate')

var http = require('./utils/http_utils')
var files = require('./utils/get_files')

var DIR = __dirname + '/files/'

describe('Serve', function() {
  afterEach(function(done) {
    http.stopServer(done)
  })
  describe('#serve(jquery.min.js)', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('jquery.min.js', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        done()
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('jquery.min.js', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        res.should.have.status(200)
        done()
      })
    })
    it('Should have appropriate content-type header', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('jquery.min.js', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        res.headers.should.have.property('content-type')
        res.headers['content-type'].should.equal('application/javascript')
        done()
      })
    })
    it('Should serve complete data', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('jquery.min.js', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        data.should.equal(files['jquery.min.js'])
        done()
      })
    })
  })
  describe('#serve(font-awesome.css)', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('font-awesome.css', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        done()
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('font-awesome.css', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        res.should.have.status(200)
        done()
      })
    })
    it('Should have appropriate content-type header', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('font-awesome.css', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        res.headers.should.have.property('content-type')
        res.headers['content-type'].should.equal('text/css')
        done()
      })
    })
    it('Should serve complete data', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('font-awesome.css', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        data.should.equal(files['font-awesome.css'])
        done()
      })
    })
  })
  describe('#serve(nodejs.jpeg)', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('nodejs.jpeg', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        done()
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('nodejs.jpeg', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        res.should.have.status(200)
        done()
      })
    })
    it('Should have appropriate content-type header', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('nodejs.jpeg', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        res.headers.should.have.property('content-type')
        res.headers['content-type'].should.equal('image/jpeg')
        done()
      })
    })
    it('Should serve complete data', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('nodejs.jpeg', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        data.should.equal(files['nodejs.jpeg'])
        done()
      })
    })
  })
  describe('#serve(asdf)', function() {
    it('Should return status code 404', function(done) {
      var lactate = Lactate.Lactate({
        root:DIR
      })
      http.server(function(req, res) {
        lactate.serve('asdf', req, res)
      })
      http.client('/', function(err, res, data) {
        if (err) { return done(err) }
        res.should.have.status(404)
        done()
      })
    })
  })
})
