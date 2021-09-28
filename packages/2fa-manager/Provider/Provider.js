export default class Provider {
  constructor (name) {
    this._isValidArguments(name)

    this.name = name
  }

  init (ee, options) {
    return null
  }

  async send (model, session) {
    return null
  }

  async check (model, session, token) {
    return null
  }

  getName () {
    return this.name
  }

  _isValidArguments (name) {
    if (typeof name !== 'string') {
      throw new TypeError('[@startupjs/2fa-manager/Provider]: Invalid argument name. Must be a string!')
    }
  }
}
