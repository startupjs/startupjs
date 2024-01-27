// TODO: Maybe use a simple native implementation in future.
//       Problem was that EventTarget was not available in expo on android
// import EventEmitter from './EventEmitter.js'
import EventEmitter from './FbEventEmitter.js'
import Plugin from './Plugin.js'

export default class Module extends EventEmitter {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  _options = {}
  plugins = {}
  initialized = false

  constructor (parentRegistry, name) {
    super()
    this.name = name
    this.registry = parentRegistry
  }

  getPlugin (pluginName) {
    if (!pluginName) throw Error('[@startupjs/registry] You must pass plugin name into getPlugin()')
    if (!this.plugins[pluginName]) {
      this.plugins[pluginName] = this.newPlugin(this, pluginName)
    }
    return this.plugins[pluginName]
  }

  newPlugin (...args) {
    return new Plugin(...args)
  }

  get options () {
    if (!this.initialized) throw Error(`Module "${this.name}" is not initialized yet`)
    return this._options
  }

  init (optionsByEnv = {}) {
    if (this.initialized) throw Error(`Module "${this.name}" already initialized`)
    this.initialized = true
    for (const env in optionsByEnv) {
      const {
        init,
        ...options
      } = optionsByEnv[env] || {}
      Object.assign(this.options, options)
      const hooks = init?.(options, this)
      if (typeof hooks === 'object') {
        for (const hookName in hooks) this.on(hookName, hooks[hookName])
      }
    }
  }

  // ------------------------------------------
  //   Execution
  // ------------------------------------------

  // Run hook for each plugin and return an array of results
  hook (hookName, ...args) {
    this.emit(hookName, ...args)
    const results = []
    for (const pluginName in this.plugins) {
      const plugin = this.getPlugin(pluginName)
      if (!plugin.hasHook(hookName)) continue
      const pluginResult = plugin.runHook(hookName, ...args)
      if (pluginResult != null) results.push(pluginResult)
    }
    return results
  }

  asyncHook (...args) {
    // TODO: this.emit is not async. We should add await emit support to EventEmitter
    return Promise.all(this.hook(...args))
  }

  // Works the same as Array.reduce but for the list of plugins
  reduceHook (hookName, initialValue, ...args) {
    this.emit(hookName, ...args) // TODO: Should we pass value to this.emit?
    let value = initialValue
    for (const pluginName in this.plugins) {
      const plugin = this.getPlugin(pluginName)
      if (!plugin.hasHook(hookName)) continue
      value = plugin.runHook(hookName, value, ...args)
    }
    return value
  }
}
