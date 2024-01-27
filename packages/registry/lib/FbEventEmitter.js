import fbemitter from 'fbemitter'

const { EventEmitter } = fbemitter

export default class FbEventEmitter extends EventEmitter {
  on (...args) {
    return this.addListener(...args)
  }

  off (...args) {
    throw Error('[@startupjs/registry] .off() is not implemented. Instead use:\n' +
      '  const listener = MODULE.on(...)\n' +
      '  listener.remove()')
  }
}
