import Registry from '../lib/Registry.js'
import ClientModule from './ClientModule.js'

export default class ClientRegistry extends Registry {
  newModule (...args) {
    return new ClientModule(...args)
  }
}
