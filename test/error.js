var mesh = require('./util').mesh
var test = require('./util').test
var assert = require('assert')

test('error', function () {
  var m = mesh()

  m.authoritee.onAbs('key', function () {})

  var failed = false

  try {
    m.authoritee.onAbs('key', function () {})
  } catch (err) {
    failed = true
  }

  assert(failed, 'no error thrown')
})
