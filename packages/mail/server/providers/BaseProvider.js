// Base provider - interface for all other providers
export default class BaseProvider {
  constructor (params) {
    if (this.instance) return this
    constructor(params)
    this.instance = this._initClient(params)
    return this
  }

  _initClient () {
    throw new Error('[@startupjs/mail] "initClient" not implemented')
  }

  send () {
    throw new Error('[@startupjs/mail] "send" not implemented')
  }
}
