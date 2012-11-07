
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

player.on('cords', function (cords, last) {
  if (cords.x - last.x > 10) cords.x = last.x + 10
})

// Replicate
var server = http.createServer()
server.listen(3000)

var sock = shoe(function (stream) {
  ps.pipe(stream).pipe(ps)
})

sock.install(server, '/stream')
```
