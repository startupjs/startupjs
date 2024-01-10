const util = require('racer/lib/util.js')

mockBrowserify()

// on the server we need to fix module.require since it's non-existent
// The simplest way to do it seems to be to just bluntly hardcode each case
// of serverRequire usage in Racer which are:
// 1. racer/lib/Racer.server.js:
//      - util.serverRequire(module, './Racer.server');
// 2. racer/lib/Model/index.js:
//      - util.serverRequire(module, './bundle');
//      - util.serverRequire(module, './connection.server');
function mockBrowserify () {
  util.serverRequire = (_, id) => {
    if (id === './Racer.server') {
      return require('racer/lib/Racer.server.js')
    } else if (id === './bundle') {
      return require('racer/lib/Model/bundle.js')
    } else if (id === './connection.server') {
      return require('racer/lib/Model/connection.server.js')
    } else {
      throw Error(`mockBrowserify/serverRequire: Unknown id: ${id}`)
    }
  }
}

// TODO: maybe use this if we have to do server-side rendering
// Mock 'window' object to have client-side libs working for server rendering,
// like browserchannel which requires 'window.location' to exist.
// function mockWindow () {
//   if (typeof window === 'undefined') globalThis.window = {}
//   globalThis.window.location = globalThis.window.location || {}
//   globalThis.window.location.protocol = globalThis.window.location.protocol || 'http:'
//   globalThis.window.location.hostname = globalThis.window.location.hostname || 'localhost'
//   globalThis.window.location.port = globalThis.window.location.port || '3000'
// }

module.exports = () => {}
