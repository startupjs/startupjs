export default class BaseMailProvider {
  constructor (name, send) {
    this.name = name
    this._send = send
  }

  getName () {
    return this.name
  }

  async send () {
    await this._send()
  }
}
