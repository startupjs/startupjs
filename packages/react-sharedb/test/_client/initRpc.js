import racer from 'racer'
import racerRpc from 'racer-rpc'
import { model } from '../../src'

// Start WS connection to server
model.createConnection()

// RPC support
racer.use(racerRpc)

// Pipe rpc requests to the server model.
// Used to trigger changes to data from the server-side.
export default new Proxy(
  {},
  {
    get (target, propKey) {
      return function (...args) {
        if (/Async$/.test(propKey)) {
          return new Promise(resolve => {
            model.call('model', propKey, ...args.concat([resolve]))
          })
        } else {
          model.call('model', propKey, ...args.concat([() => {}]))
        }
      }
    }
  }
)
