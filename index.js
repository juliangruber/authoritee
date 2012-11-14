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
  var changed = update[1]

  var now = Date.now()
  var dt = now - this.last[key]

  if (this.abs[key]) {
    update[1] = this.abs[key](changed, this.get(key), dt)
  } else if (this.rel[key] && typeof this.get(key) != 'undefined') {
    var delta = getDelta(changed, this.get(key))
    delta = this.rel[key](delta, dt)
    update[1] = applyDelta(this.get(key), delta)
  }

  this.last[key] = now
  return applyUpdate.call(this, update)
}

/**
 * Delta utility functions
 */

function getDelta (changed, current) {
  if (typeof current == 'number') return changed - current

  var delta = {}
  Object.keys(changed).forEach(function (k) {
    delta[k] = changed[k] - current[k]
  })

  return delta
}

function applyDelta (obj, delta) {
  if (typeof obj == 'number') return obj + delta

  var changed = {}
  Object.keys(delta).forEach(function (k) {
    changed[k] = obj[k] + delta[k]
  })

  return changed
}
