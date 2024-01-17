import { Duplex } from 'stream'

const OPEN = 1 // WebSocket.OPEN

/**
 * @param {EventEmitter} client is a SockJS client session for each
 *   browser window/tab which connects to the server
 * @param {ClientStream} ClientStream is a stream class that is used to create
 *   the stream. It is passed in as a parameter to allow for different stream implementations
 * @return {Duplex} stream
 */
export default function createStream (client) {
  const stream = new SockJsClientStream(client)

  client.on('data', function onMessage (message) {
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

export class SockJsClientStream extends Duplex {
  static _type = 'sockjs'

  constructor (client) {
    super({ objectMode: true })
    this.client = client

    this.on('error', err => {
      // log stream type and error
      console.warn(`[@startupjs/channel] ${this.constructor._type} client message stream error`, err)
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
    if (this.client.readyState !== OPEN) return cb()
    try {
      this.client.write(JSON.stringify(chunk))
    } catch (err) {
      console.error(`[@startupjs/channel] ${this.constructor._type} send:`, err)
    }
    cb()
  }

  _stopClient () {
    this.client.close()
  }
}
