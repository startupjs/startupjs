import { ClientStream, createStream } from './createStream.js'

export default function createBrowserChannelStream (client) {
  return createStream(client, BrowserChannelClientStream)
}

export class BrowserChannelClientStream extends ClientStream {
  static get _type () { return 'BrowserChannel' }

  _write (chunk, encoding, cb) {
    // Silently drop messages after the session is closed
    if (this.client.state === 'closed') return cb()
    this.client.send(chunk)
    cb()
  }

  _stopClient () {
    this.client.stop(() => {
      this.client.close()
    })
  }
}
