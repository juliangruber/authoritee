var test = require('./util').test
var mesh = require('./util').mesh
var assert = require('assert')

test('relative', function () {
  var m = mesh()

  assert(m.authoritee.onAbs instanceof Function, '#onAbs')

  m.authoritee.onRel('cords', function (dcords, dt) {
    if (Math.sqrt(dcords.x * dcords.x, dcords.y * dcords.y) > 1) {
      dcords.x = dcords.y = 0
    }
    return dcords
  })

  var updates = 0
  m.modelC.on('update', function (key, val) {
    if (key != 'cords') return

    updates++
    console.log('update received', val)

    assert(val.x == 51 && val.y == 50, 'corrected value')
  }) 

  process.on('exit', function () {
    assert(updates == 1, "ditn't call")
  })

  m.modelB.set('cords', { x : 50, y : 50 })
  m.modelB.set('cords', { x : 51, y : 50 })
  m.modelB.set('cords', { x : 100, y : 100 })
})
