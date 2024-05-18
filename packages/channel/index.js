import SockJS from './SockJS.cjs'
import { DEFAULT_PATH } from './constants.js'

export { DEFAULT_PATH }

export default class Socket {
  constructor ({
    path = DEFAULT_PATH,
    baseUrl = guessBaseUrl(),
    reconnect = true,
    allowXhrFallback = false,
    forceXhrFallback = false,
    timeout = 10000,
    timeoutIncrement = 10000
  } = {}) {
    this._reconnect = reconnect
    this._timeout = timeout
    this._timeoutIncrement = timeoutIncrement
    this._url = getConnectionUrl(baseUrl, path)
    this._allowXhrFallback = forceXhrFallback || allowXhrFallback
    this._useXhrFallback = forceXhrFallback

    this._messageQueue = []
    this._connectedOnce = false
    this._attemptNum = 0

    this.open()
  }

  open () {
    if (this._useXhrFallback) {
      this._type = 'xhr'
      this._url = this._url.replace(/^ws/, 'http')
      this._socket = new SockJS(this._url, undefined, { transports: 'xhr-polling' })
    } else {
      this._type = 'websocket'
      this._url = this._url.replace(/^http/, 'ws')
      this._socket = new WebSocket(this._url)
    }

    this._syncState()

    this._socket.onmessage = this._onmessage.bind(this)
    this._socket.onopen = this._onopen.bind(this)
    this._socket.onclose = this._onclose.bind(this)
    this._socket.onerror = this._onerror.bind(this)
  }

  _onmessage (message) {
    this._syncState()
    this.onmessage?.(message)
  }

  _onopen (event) {
    this._attemptNum = 0
    this._connectedOnce = true

    this._syncState()
    this._flushQueue()

    this.onopen?.(event)
  }

  _onclose (event) {
    this._syncState()

    this.onclose?.(event)

    if (!this._useXhrFallback && this._allowXhrFallback && !this._connectedOnce) {
      this._useXhrFallback = true
      return this.open()
    }

    if (this._reconnect && !event.wasClean) {
      setTimeout(() => this.reconnect(), this._getTimeout())
    }
    this._attemptNum++
  }

  _onerror (err) {
    this._syncState()
    this.onerror?.(err)
  }

  _getTimeout () {
    const base = this._timeout
    const increment = this._timeoutIncrement * this._attemptNum
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
      this.open()
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

function guessBaseUrl () {
  let baseUrl
  if (typeof window !== 'undefined') baseUrl = window.location?.origin
  if (!baseUrl) throw Error(ERRORS.noBaseUrl)
  return baseUrl
}

function getConnectionUrl (baseUrl, path) {
  if (typeof path !== 'string') throw Error(ERRORS.noRoute)
  if (typeof baseUrl !== 'string') throw Error(ERRORS.noBaseUrl)
  baseUrl = baseUrl.replace(/\/$/, '')
  return baseUrl + path
}

// Maybe need to use reconnection timing algorithm from
// http://blog.johnryding.com/post/78544969349/how-to-reconnect-web-sockets-in-a-realtime-web-app

const ERRORS = {
  noBaseUrl: '[@startupjs/channel] No baseUrl provided to connect to the server',
  noRoute: '[@startupjs/channel] Route must be a string. If you want to connect to the root, pass an empty string'
}
