
# authorative-model

## Usage

On the client:

```javascript
var Model = require('authorative-model')
var shoe = require('shoe')

var player = new Model()
var ps = player.createStream()

player.set('cords', { x : 10, y : 35 })
player.get('cords') == { x : 10, y : 35 }

// after 1 sec
player.set('cords', { x : 11, y : 35 })
player.get('cords') == { x : 11, y : 35 }

// after 1 sec
player.set('cords', { x : 30, y : 59 }) // cheater
player.get('cords') == { x : 11, y : 35 }

// Replicate
ps.pipe(shoe('/stream')).pipe(ps)
```

On the server:

```javascript
var Model = require('authorative-model')
var shoe = require('shoe')
var http = require('http')

var player = new Model()
var ps = player.createStream()

// Refuse movements of more then one length entity per second
player.on('cords', function (cords1, cords0, t) {
  var dist = Math.sqrt(Math.pow(cords1.x - cords0.x, 2) + Math.pow(cords1.y - cords0.y, 2))
  if (dist > t / 1000) cords2 = cords1
})

// Replicate
var server = http.createServer()
server.listen(3000)

var sock = shoe(function (stream) {
  ps.pipe(stream).pipe(ps)
})

sock.install(server, '/stream')
```
