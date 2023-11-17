export default class ShareDBAccessError extends Error {
  constructor (code, message) {
    super(message)

    this.code = code
    this.name = 'ShareDBAccessError'
  }
}
