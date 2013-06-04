var test = require('./util').test
var mesh = require('./util').mesh
var assert = require('assert')

test('absolute', function () {
  var m = mesh()

  assert(m.authoritee.onAbs instanceof Function, '#onAbs')

  m.authoritee.onAbs('cords', function (cords1, cords0, dt) {
    if (!cords0) return cords1
    var dx = cords1.x - cords0.x
    var dy = cords1.y - cords0.y
    if (Math.sqrt(dx * dx, dy * dy) > 1) return cords0
    return cords1
  })

  var updates = 0
  m.modelC.on('update', function (change, timestamp, source) {
    var key = change[0]
    var val = change[1]
    if (key != 'cords') return

    updates++
    assert(val.x == 51 && val.y == 50, 'corrected value')
  }) 

  process.on('exit', function () {
    assert(updates == 1, "ditn't call")
  })

  m.modelB.set('cords', { x : 50, y : 50 })
  m.modelB.set('cords', { x : 51, y : 50 })
  m.modelB.set('cords', { x : 100, y : 100 })
})
