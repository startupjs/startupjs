// import { BCSocket } from 'browserchannel/dist/bcsocket-uncompressed'
import SockJS from './SockJS.cjs'

const useSockJS = true

const WebSocket = useSockJS ? SockJS : globalThis.WebSocket

export default class Socket {
  constructor (options) {
    this._options = options
    this._messageQueue = []
    this._connectedOnce = false
    this._attemptNum = 0
    this._url = getWebSocketURL(options).replace('ws:', useSockJS ? 'http:' : 'ws:')

    // if (typeof WebSocket !== 'undefined' && !options.forceBrowserChannel) {
    this._createWebSocket()
    // } else if (!options.forceWebSocket) {
    //   this._createBrowserChannel()
    // }
  }

  _createWebSocket () {
    this._type = 'websocket'
    this._socket = useSockJS ? new WebSocket(this._url, undefined, { transports: 'xhr-polling' }) : new WebSocket(this._url)

    this.open = this._createWebSocket.bind(this)
    this._syncState()

    this._socket.onmessage = this._ws_onmessage.bind(this)
    this._socket.onopen = this._ws_onopen.bind(this)
    this._socket.onclose = this._ws_onclose.bind(this)
  }

  _createBrowserChannel () {
    this._type = 'browserchannel'
    // this._socket = BCSocket(this._options.base, this._options)

    this.open = this._createBrowserChannel.bind(this)
    this._syncState()

    this._socket.onmessage = this._bc_onmessage.bind(this)
    this._socket.onopen = this._bc_onopen.bind(this)
    this._socket.onclose = this._bc_onclose.bind(this)
  }

  _ws_onmessage (message) {
    this._syncState()
    console.log('>>> received message', message)
    this.onmessage && this.onmessage(message)
  }

  _ws_onopen (event) {
    this._attemptNum = 0
    this._connectedOnce = true

    this._syncState()
    this._flushQueue()

    this.onopen && this.onopen(event)
  }

  _ws_onclose (event) {
    this._syncState()
    console.log('SockJS: connection is broken', this._url, event)

    this.onclose && this.onclose(event)

    // if (!this._connectedOnce) {
    //   return this._createBrowserChannel()
    // }

    const socket = this

    if (this._options.reconnect && !event.wasClean) {
      setTimeout(() => {
        if (socket.readyState === socket.CLOSED) {
          socket._createWebSocket()
        }
      }, this._getTimeout())
    }
    this._attemptNum++
  }

  _getTimeout () {
    const base = this._options.timeout
    const increment = this._options.timeoutIncrement * this._attemptNum
    const maxTimeout = base + increment
    return getRandom(maxTimeout / 3, maxTimeout)
  }

  _bc_onmessage (data) {
    this._syncState()
    this.onmessage && this.onmessage(data)
  }

  _bc_onopen (event) {
    this._syncState()
    this.onopen && this.onopen(event)
  }

  _bc_onclose (event) {
    this._syncState()
    this.onclose && this.onclose(event)
  }

  _flushQueue () {
    while (this._messageQueue.length !== 0) {
      const data = this._messageQueue.shift()
      this._send(data)
    }
  }

  _send (data) {
    if (this._type === 'websocket' && typeof data !== 'string') {
      data = JSON.stringify(data)
    }

    this._socket.send(data)
  }

  send (data) {
    if (this._type === 'websocket') {
      if (this._socket.readyState === WebSocket.OPEN && this._messageQueue.length === 0) {
        this._send(data)
      } else {
        this._messageQueue.push(data)
      }
    } else {
      this._send(data)
    }
  }

  close () {
    this._socket.close()
  }

  _syncState () {
    this.readyState = this._socket.readyState
  }

  reconnect () {
    if (this._type === 'websocket' && this.readyState === this.CLOSED) {
      this._createWebSocket()
    }
  }
}

Object.assign(Socket.prototype, {
  // ShareJS constants
  canSendWhileConnecting: true,
  canSendJSON: true,

  // WebSocket constants
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
})

function getRandom (min, max) {
  return Math.random() * (max - min) + min
}

function getWebSocketURL (options) {
  let port = typeof window !== 'undefined' && window.location && window.location.port
  let host = typeof window !== 'undefined' && window.location && window.location.hostname
  let protocol = typeof window !== 'undefined' && window.location && window.location.protocol

  host = options.srvHost || host
  protocol = options.srvProtocol || protocol

  if (protocol === 'https:' || protocol === 'wss:') {
    protocol = 'wss:'
    port = options.srvSecurePort || options.srvPort || port
  } else {
    protocol = 'ws:'
    port = options.srvPort || port
  }

  return protocol + '//' + host + (port ? ':' + port : '') + options.base
}

// Maybe need to use reconnection timing algorithm from
// http://blog.johnryding.com/post/78544969349/how-to-reconnect-web-sockets-in-a-realtime-web-app
