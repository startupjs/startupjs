// there is no way to transfer any fields other than message and code, becouse https://github.com/share/sharedb/blob/master/lib/agent.js#L278
function ShareDBAccessError (code, message) {
  this.code = code
  this.message = message || ''
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ShareDBAccessError)
  } else {
    this.stack = new Error().stack
  }
}

ShareDBAccessError.prototype = Object.create(Error.prototype)
ShareDBAccessError.prototype.constructor = ShareDBAccessError
ShareDBAccessError.prototype.name = 'ShareDBAccessError'

module.exports = ShareDBAccessError
