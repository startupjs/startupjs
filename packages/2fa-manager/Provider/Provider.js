export default class Provider {
  constructor (name, init, send, check) {
    this._isValidArguments(name, init, send, check)

    this.name = name
    this.init = init
    this.send = send
    this.check = check
  }

  getName () {
    return this.name
  }

  _isValidArguments (name, init, send, check) {
    if (typeof name !== 'string') {
      throw new TypeError('Invalid argument name. Must be a string!')
    }
    if (typeof init !== 'function') {
      throw new TypeError('Invalid argument init. Must be a function!')
    }
    if (typeof send !== 'function') {
      throw new TypeError('Invalid argument send. Must be a function!')
    }
    if (typeof check !== 'function') {
      throw new TypeError('Invalid argument check. Must be a function!')
    }
  }
}
