var inherits = require('util').inherits
var Model = require('scuttlebutt/model')

module.exports = Authoritee

function Authoritee () {
  if (!(this instanceof Authoritee)) return new Authoritee()

  Model.call(this)
  this.abs = {}
  this.rel = {}
  this.last = {}
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

  var now = Date.now()

  if (this.abs[key]) {
    update[1] = this.abs[key](val, this.get(key), now - this.last[key])
  } else if (this.rel[key]) {
    update[1] = this.rel[key](update)
  }

  this.last[key] = now

  return applyUpdate.call(this, update)
}
