import WebSocket from 'ws'
import { Duplex } from 'stream'

/**
 * @param {EventEmitter} client is a websocket client session for each
 *   browser window/tab which connects to the server
 * @param {ClientStream} ClientStream is a stream class that is used to create
 *   the stream. It is passed in as a parameter to allow for different stream implementations
 * @return {Duplex} stream
 */
export default function createStream (client) {
  const stream = new WebSocketClientStream(client)

  client.on('message', function onMessage (message) {
    let data
    try {
      data = JSON.parse(message)
    } catch (err) {
      stream.emit('error', err)
      return
    }
    stream.push(data)
  })

  client.on('close', function () {
    // Signal data writing is complete. Emits the 'end' event
    stream.push(null)
  })

  return stream
}

export class WebSocketClientStream extends Duplex {
  static _type = 'websocket'

  constructor (client) {
    super({ objectMode: true })
    this.client = client

    this.on('error', (error) => {
      // log stream type and error
      console.warn(`[@startupjs/channel] ${this.constructor._type} client message stream error`, error)
      this._stopClient()
    })

    // The server ended the writable stream. Triggered by calling stream.end()
    // in agent.close()
    this.on('finish', () => {
      this._stopClient()
    })
  }

  _read () {}

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
