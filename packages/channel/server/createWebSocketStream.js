import WebSocket from 'ws'
import { ClientStream, createStream } from './createStream.js'

export default function createWebSocketStream (client) {
  return createStream(client, WebSocketClientStream)
}

export class WebSocketClientStream extends ClientStream {
  static get _type () { return 'WebSocket' }

  _write (chunk, encoding, cb) {
    // Silently drop messages after the session is closed
    if (this.client.readyState !== WebSocket.OPEN) return cb()
    this.client.send(JSON.stringify(chunk), (err) => {
      if (err) console.error('[@startupjs/channel] send:', err)
    })
    cb()
  }

  _stopClient () {
    this.client.close()
  }
}
