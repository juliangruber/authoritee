var Authoritee = require('../')
var assert = require('assert')
var Model = require('scuttlebutt/model')
var mesh = require('./util').mesh
var test = require('./util').test

test('constructor', function () {
  assert(new Authoritee() instanceof Authoritee, 'constructor with new')
  assert(Authoritee() instanceof Authoritee, 'constructor w/out new')

  assert(Authoritee() instanceof Model, 'scuttlebutt model')
})

test('chainable', function () {
  var auth = new Authoritee()
  assert(auth.onAbs(), auth, 'chainable onAbs')
  assert(auth.onRel(), auth, 'chainable onRel')
})
