export default class Provider {
  constructor (name, send, check) {
    this._isValidArguments(name, send, check)

    this.name = name
    this.send = send
    this.check = check
  }

  getName () {
    return this.name
  }

  _isValidArguments (name, send, check) {
    if (typeof name !== 'string') {
      throw new TypeError('Invalid argument name. Must be a string!')
    }
    if (typeof send !== 'function') {
      throw new TypeError('Invalid argument send. Must be a function!')
    }
    if (typeof check !== 'function') {
      throw new TypeError('Invalid argument check. Must be a function!')
    }
  }
}
