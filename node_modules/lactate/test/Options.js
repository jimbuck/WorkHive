
var Lactate = require('../lib/lactate')
var should = require('should')

var path = require('path');

describe('Options', function() {

  describe('Constructor', function() {

    var lactate = Lactate.Lactate({
      'root':'files',
      'from':'files',
      'cache':false,
      'max_age':'one hour'
    })

    it('Should have root option "files"', function() {
      var opt = lactate.get('root')
      var root_path = path.resolve('files');
      opt.should.equal(root_path);
    })

    it('Should have public option "from"', function() {
      var opt = lactate.get('from')
      opt.should.equal('files')
    })

    it('Should have cache option false', function() {
      var opt = lactate.get('cache')
      opt.should.equal(false)
    })

    it('Should have max_age option 3600', function() {
      var opt = lactate.get('max_age')
      opt.should.equal(3600)
    })

  })

  describe('#set(object)', function() {

    var lactate = Lactate.Lactate()
    lactate.set({
      'root':'files',
      'from':'files',
      'cache':false,
      'max_age':'one hour'
    })

    it('Should have root option "files"', function() {
      var opt = lactate.get('root')
      var root_path = path.resolve('files');
      opt.should.equal(root_path);
    })

    it('Should have public option "files"', function() {
      var opt = lactate.get('from')
      opt.should.equal('files')
    })

    it('Should have cache option false', function() {
      var opt = lactate.get('cache')
      opt.should.equal(false)
    })

    it('Should have max_age option 3600', function() {
      var opt = lactate.get('max_age')
      opt.should.equal(3600)
    })

  })

  describe('#set("root", "files")', function() {
    it('Should have root option "files"', function() {
      var lactate = Lactate.Lactate()
      lactate.set('root', 'files')
      var root_path = path.resolve('files');
      var opt = lactate.get('root')
      opt.should.equal(root_path);
    })
  })

  describe('#set("from", "files")', function() {
    it('Should have from option "files"', function() {
      var lactate = Lactate.Lactate()
      lactate.set('from', 'files')
      var opt = lactate.get('from')
      opt.should.equal('files')
    })
  })

  describe('#set("cache", false)', function() {
    it('Should have cache option false', function() {
      var lactate = Lactate.Lactate()
      lactate.set('cache', false)
      var opt = lactate.get('cache')
      opt.should.equal(false)
    })
  })

  describe('#set("max_age", "one hour")', function() {
    it('Should have max_age option 3600', function() {
      var lactate = Lactate.Lactate()
      lactate.set('max_age', 3600)
      var opt = lactate.get('max_age')
      opt.should.equal(3600)
    })
  })

})
