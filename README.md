# authoritee

restepk my authoritative model!

Add authoritative nodes to your net of scuttlebutt models.

## Usage

In a game you might want to limit players' movements to no more than 1 length
entity per second, to prevent cheating. 

On the server use authoritee:

```javascript
var Authoritee = require('authoritee')
var player = new Authoritee()

// There are two modes: relative and absolute.
// Here relative is better
player.onRel('cords', function (dcords, dt) {
  var delta = Math.sqrt(dcords.x * dcords.x, dcords.y * dcords.y)
  if (delta > dt / 1000 || delta > 1) dcords.x = dcords.y = 0
  return dcords
})

// Replicate
var ps = player.createStream()

var http = require('http')
var server = http.createServer()
server.listen(3000)

var shoe = require('shoe')
var sock = shoe(function (stream) {
  ps.pipe(stream).pipe(ps)
})
sock.install(server, '/stream')
```

On the client just use scuttlebutt:

```javascript
var Model = require('scuttlebutt/model')
var player = new Model()

player.on('update', function (key, value) {
  if (key == 'cords') moveTo(value.x, value.y)
})

// Just apply updates as you wish, the server will update your model
// if you did something wrong

player.set('cords', { x : 10, y : 35 })
// authorative model replicates good initial cords

// after 1 second
player.set('cords', { x : 11, y : 35 })
// authorative model replicates good cords

// now a cheat
player.set('cords', { x : 30, y : 59 })
// authorative model replicates corrected cords and corrects the client

// Replicate
var ps = player.createStream()
var shoe = require('shoe')
ps.pipe(shoe('/stream')).pipe(ps)
```

## API

### Authoritee()

create a new `authoratee` model.

### Model#set(key, value)

store `value` at `key` inside the model.

### Model#get(key)

get the `value` associated with `key`.

### Model#onAbs(key, cb)

Executes `cb` whenever a node tries to change the `value` stored at `key` with
the following arguments:

* the proposed new value
* the current value
* the time in miliseconds that passed since the last valid update

The value that `cb` returns will be stored at `key`. __You need to do this
even if you just accept__.

If no listeners are registered for changes to `key`, all changes are accepted.

### Model#onRel(key, cb)

Executes `cb` whenever a node tries to change the value stored at `key` with
the following arguments:

* the calculate change of value, supporting numbers and numbers in objects
* the time in miliseconds that passed since the last valid update

The `change` object/number that `cb` returns will be applied on the curent
`value`.

If no listeners are registered for changes to `key`, all changes are accepted.

### Model#on('update', function (key, value, source))

Executes `cb` whenever the value stored at `key` changes.

### Model#createStream()

create a duplex stream for replicating with other scuttlebutt / authoritee nodes

## Installation

```bash
npm install autoritee
```

## License

(MIT)

Copyright (c) 2012 &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
