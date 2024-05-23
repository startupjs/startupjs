import { ACCESS_ERROR_CODES } from './constants.js'

export default class ShareDBAccessError extends Error {
  constructor (code, message) {
    super(message)

    this.CODES = ACCESS_ERROR_CODES
    this.code = code
    this.name = 'ShareDBAccessError'
  }
}
