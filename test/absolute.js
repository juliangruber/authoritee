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

  var update = 0
  m.modelC.on('update', function (key, val) {
    if (key != 'cords') return

    switch (update) {
      case 0: assert(val.x == 50 && val.y == 50, 'initial'); break;
      case 1: assert(val.x == 51 && val.y == 50, 'valid'); break;
      case 2: assert(val.x == 51 && val.y == 50, 'invalid'); break;
    }

    update++
  }) 

  process.on('exit', function () {
    console.log("updates:", update)
    assert(update > 0, "ditn't call")
  })

  m.modelB.set('cords', { x : 50, y : 50 })
  m.modelB.set('cords', { x : 51, y : 50 })
  m.modelB.set('cords', { x : 100, y : 100 })
})
