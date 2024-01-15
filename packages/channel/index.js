import SockJS from './SockJS.cjs'

export default class Socket {
  constructor (options) {
    this._options = options
    this._messageQueue = []
    this._connectedOnce = false
    this._attemptNum = 0
    this._url = getWebSocketURL(options)
    this._useXhrFallback = options.forceXhrFallback
    this._allowXhrFallback = this._useXhrFallback || options.allowXhrFallback

    this._createWebSocket()
  }

  _createWebSocket () {
    if (this._useXhrFallback) {
      this._type = 'xhr'
      this._url = this._url.replace(/^ws/, 'http')
      this._socket = new SockJS(this._url, undefined, { transports: 'xhr-polling' })
    } else {
      this._type = 'websocket'
      this._url = this._url.replace(/^http/, 'ws')
      this._socket = new WebSocket(this._url)
    }

    this.open = this._createWebSocket.bind(this)
    this._syncState()

    this._socket.onmessage = this._ws_onmessage.bind(this)
    this._socket.onopen = this._ws_onopen.bind(this)
    this._socket.onclose = this._ws_onclose.bind(this)
  }

  _ws_onmessage (message) {
    this._syncState()
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

    this.onclose && this.onclose(event)

    if (!this._useXhrFallback && this._allowXhrFallback && !this._connectedOnce) {
      this._useXhrFallback = true
      return this._createWebSocket()
    }

    if (this._options.reconnect && !event.wasClean) {
      setTimeout(() => this.reconnect(), this._getTimeout())
    }
    this._attemptNum++
  }

  _getTimeout () {
    const base = this._options.timeout
    const increment = this._options.timeoutIncrement * this._attemptNum
    const maxTimeout = base + increment
    return getRandom(maxTimeout / 3, maxTimeout)
  }

  _flushQueue () {
    while (this._messageQueue.length !== 0) {
      const data = this._messageQueue.shift()
      this._send(data)
    }
  }

  _send (data) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data)
    }

    this._socket.send(data)
  }

  send (data) {
    if (this._socket.readyState === this.OPEN && this._messageQueue.length === 0) {
      this._send(data)
    } else {
      this._messageQueue.push(data)
    }
  }

  close () {
    this._socket.close()
  }

  _syncState () {
    this.readyState = this._socket.readyState
  }

  reconnect () {
    if (this.readyState === this.CLOSED) {
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
  let baseUrl
  baseUrl ??= options.baseUrl
  if (typeof window !== 'undefined') baseUrl ??= window.location?.origin
  if (!baseUrl) throw Error('[@startupjs/channel] No baseUrl provided to connect to the server')
  baseUrl.replace(/\/$/, '')
  return baseUrl + options.base
}

// Maybe need to use reconnection timing algorithm from
// http://blog.johnryding.com/post/78544969349/how-to-reconnect-web-sockets-in-a-realtime-web-app
