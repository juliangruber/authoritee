
# authorative-model

## Usage

On the client:

```javascript
var Model = require('authorative-model')
var shoe = require('shoe')

var player = new Model()
var ps = player.createStream()

player.set('cords', { x : 10, y : 35 })

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

// Move max. one length entity per second
player.on('cords', function (cords, last, t) {
  var dist = Math.sqrt(Math.pow(cords.x - last.x, 2) + Math.pow(cords.y - last.y, 2))
  if (dist > t / 1000) {
    cords = last
  }
})

// Replicate
var server = http.createServer()
server.listen(3000)

var sock = shoe(function (stream) {
  ps.pipe(stream).pipe(ps)
})

sock.install(server, '/stream')
```
