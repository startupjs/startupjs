# @startupjs/signals-orm

## Installation

### Client-only mode

If you just want a client-only mode without any data being synced to the server, then you don't need to setup anything. Skip to the [Usage] section of this readme.

### Synchronization of data with server

Enable the connection on client somewhere early in your client app:

```js
import connect from '@startupjs/signals-orm/connect'
connect()
```

And on the server, manually create a [ShareDB's backend](https://share.github.io/sharedb/api/backend) and create a connection handler for WebSockets:

```js
import { initConnection } from '@startupjs/signals-orm/server'
const { upgrade } = initConnection(backend) // ShareDB's Backend instance
server.on('upgrade', upgrade) // Node's 'http' server instance
```

## Usage

TBD

## Examples

### Simplest example with server synchronization

On the client we `connect()` to the server, and we have to wrap each React component into `observer()`:

```js
// client.js
import connect from '@startupjs/signals-orm/connect'
import { observer, $, sub$ } from '@startupjs/signals-orm'
import { createRoot } from 'react-dom/client'
import { createElement as el } from 'react'

connect()

const App = observer(({ userId }) => {
  const $user = sub$($.users[userId])
  if (!$user.get()) throw $user.set({ points: 0 })
  const { $points } = $user
  const onClick = () => $points.set($points.get() + 1)
  return el('button', { onClick }, 'Points: ' + $points.get())
})

const container = document.body.appendChild(document.createElement('div'))
createRoot(container).render(
  el(App, { userId: '_1' })
)
```

On the server we create the ShareDB backend and initialize the WebSocket connections handler:

```js
// server.js
import http from 'http'
import { ShareDB, initConnection } from '@startupjs/signals-orm/server'

const server = http.createServer() // you can pass expressApp here if needed
const backend = new ShareDB()
const { upgrade } = initConnection(backend)

server.on('upgrade', upgrade)

server.listen(3000)
```

ShareDB is a re-export of [`sharedb`](https://github.com/share/sharedb) library, check its docs for more info.
- for persistency and queries support pass [`sharedb-mongo`](https://github.com/share/sharedb-mongo) (which uses MongoDB) as `{ db }`
- when deploying to a cluster with multiple instances you also have to provide `{ pubsub }` like [`sharedb-redis-pubsub`](https://github.com/share/sharedb-redis-pubsub) (which uses Redis)

## License

MIT
