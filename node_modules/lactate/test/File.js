
var should = require('should')
var Lactate = require('../lib/lactate')

var http = require('./utils/http_utils')
var files = require('./utils/get_files')

var DIR = __dirname + '/files/'

describe('File', function() {
    afterEach(function(done) {
        http.stopServer(done)
    })
    describe('#file(jquery.min.js)', function() {
        it('Should not err', function(done) {
            http.server(function(req, res) {
                Lactate.file('jquery.min.js', req, res, {
                    root:DIR
                })
            })
            http.client('/', function(err, res, data) {
                if (err) { return done(err) }
                done()
            })
        })
        it('Should have status 200', function(done) {
            http.server(function(req, res) {
                Lactate.file('jquery.min.js', req, res, {
                    root:DIR
                })
            })
            http.client('/', function(err, res, data) {
                if (err) { return done(err) }
                res.should.have.status(200)
                done()
            })
        })
        it('Should have appropriate content-type header', function(done) {
            http.server(function(req, res) {
                Lactate.file('jquery.min.js', req, res, {
                    root:DIR
                })
            })
            http.client('/', function(err, res, data) {
                if (err) { return done(err) }
                res.headers.should.have.property('content-type')
                res.headers['content-type'].should.equal('application/javascript')
                done()
            })
        })
        it('Should serve complete data', function(done) {
            http.server(function(req, res) {
                Lactate.file('jquery.min.js', req, res, {
                    root:DIR
                })
            })
            http.client('/', function(err, res, data) {
                if (err) { return done(err) }
                data.should.equal(files['jquery.min.js'])
                done()
            })
        })
    })
})

