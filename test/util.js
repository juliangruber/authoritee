var Model = require('scuttlebutt/model')
var Authoritee = require('../')

var util = module.exports = {}

util.test = function (name, fn) {
  console.log('#', name)
  fn()
}

util.mesh = function () {
  var authoritee = new Authoritee()
  var modelB = new Model()
  var modelC = new Model()

  var as = authoritee.createStream()
  var bs = modelB.createStream()
  var cs = modelC.createStream()

  bs.pipe(as).pipe(bs)
  cs.pipe(as).pipe(cs)

  return {
    authoritee : authoritee,
    modelB : modelB,
    modelC : modelC
  }
}
