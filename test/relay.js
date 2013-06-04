var test = require('./util').test
var mesh = require('./util').mesh
var assert = require('assert')

test('relay', function () {
  var m = mesh()

  var called = false
  m.modelC.on('update', function (change, timestamp, source) {
    var key = change[0]
    var val = change[1]
    called = true
    assert(key == 'foo')
    assert(val == 'bar')
  }) 

  process.on('exit', function () {
    assert(called, "ditn't pass on")
  })

  m.modelB.set('foo', 'bar')
})
