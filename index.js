var inherits = require('util').inherits
var Model = require('scuttlebutt/model')

module.exports = Authoritee

function Authoritee () {
  if (!(this instanceof Authoritee)) return new Authoritee()

  Model.call(this)
  this.abs = {}
  this.rel = {}
}

inherits(Authoritee, Model)

Authoritee.prototype.onAbs = function (key, fn) {
  if (this.abs[key] || this.rel[key]) {
    throw new Exception('Only one listener per key.')
  }
  this.abs[key] = fn
}

Authoritee.prototype.onRel = function (key, fn) {
  if (this.abs[key] || this.rel[key]) {
    throw new Exception('Only one listener per key.')
  }
  this.rel[key] = fn
}

var applyUpdate = Authoritee.prototype.applyUpdate

Authoritee.prototype.applyUpdate = function (update) {
  var key = update[0]
  var val = update[1]

  if (this.abs[key]) update = this.abs[key](update)
  if (this.rel[key]) update = this.rel[key](update)
  return applyUpdate.call(this, update)
}
