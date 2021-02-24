const ACCESS_ERROR_CODES = require('./constants').ACCESS_ERROR_CODES

// there is no way to transfer any fields other than message and code, becouse https://github.com/share/sharedb/blob/master/lib/agent.js#L278
class ShareDBAccessError extends Error {
  constructor (code, message) {
    super()
    this.CODES = ACCESS_ERROR_CODES
    this.name = 'ShareDBAccessError'
    this.code = code
    this.message = message || ''
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShareDBAccessError)
    } else {
      this.stack = new Error().stack
    }
  }
}

module.exports = ShareDBAccessError
