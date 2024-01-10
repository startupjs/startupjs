import { Duplex } from 'stream'

/**
 * @param {EventEmitter} client is a websocket/browserchannel client session for each
 *   browser window/tab which connects to the server
 * @param {ClientStream} ClientStream is a stream class that is used to create
 *   the stream. It is passed in as a parameter to allow for different stream implementations
 * @return {Duplex} stream
 */
export function createStream (client, ClientStream) {
  const stream = new ClientStream(client)

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

export class ClientStream extends Duplex {
  /** @return {string} type of stream, e.g. 'WebSocket' or 'BrowserChannel' */
  static get _type () { throw Error('not implemented') }

  constructor (client) {
    super({ objectMode: true })
    this.client = client

    this.on('error', (error) => {
      // log stream type and error
      console.warn(`${this.constructor._type} client message stream error`, error)
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
    throw Error('not implemented')
  }

  _stopClient () {
    throw Error('not implemented')
  }
}
