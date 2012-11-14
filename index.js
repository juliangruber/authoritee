var inherits = require('util').inherits
var Model = require('scuttlebutt/model')

module.exports = Authoritee

function Authoritee () {
  if (!(this instanceof Authoritee)) return new Authoritee()

  Model.call(this)
  this.checks = {}
  this.last = {}
}

inherits(Authoritee, Model)

Authoritee.prototype.onAbs = function (key, fn) {
  if (this.checks[key]) throw new Exception('Only one listener per key.')
  this.checks[key] = fn
}

Authoritee.prototype.onRel = function (key, fn) {
  if (this.checks[key]) throw new Exception('Only one listener per key.')
  this.checks[key] = function (changed, current, dt) {
    if (!current) return changed
    var delta = getDelta(current, changed)
    delta = fn(delta, dt)
    return applyDelta(current, delta)
  }
}

var applyUpdate = Authoritee.prototype.applyUpdate

Authoritee.prototype.applyUpdate = function (update) {
  var key = update[0]
  var changed = update[1]

  var now = Date.now()
  var dt = now - this.last[key]

  if (this.checks[key]) update[1] = this.checks[key](changed, this.get(key), dt)

  this.last[key] = now
  return applyUpdate.call(this, update)
}

/**
 * Delta utility functions
 */

function getDelta (current, changed) {
  if (typeof current == 'number') return changed - current

  var delta = {}
  Object.keys(changed).forEach(function (k) {
    if (typeof current[k] != 'number') return
    delta[k] = changed[k] - current[k]
  })

  return delta
}

function applyDelta (current, delta) {
  if (typeof current == 'number') return current + delta

  var changed = {}
  Object.keys(delta).forEach(function (k) {
    if (typeof current[k] != 'number') return
    changed[k] = current[k] + delta[k]
  })

  return changed
}
