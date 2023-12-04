import Plugin from './Plugin.js'

export default class Module {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  constructor (name) {
    this.name = name
    this.plugins = new Map()
    this.initialized = false
  }

  init (config = {}) {
    if (this.initialized) throw Error(`Module "${this.name}" already registered`)
    this.config = config
    this.initialized = true
  }

  validate () {
    if (!this.initialized) throw Error(`Module "${this.name}" is not initialized`)
  }

  getPlugin (pluginName) {
    if (!this.plugins.has(pluginName)) {
      this.plugins.set(pluginName, new Plugin(this, pluginName))
    }
    return this.plugins.get(pluginName)
  }

  registerPlugin (pluginName, pluginConfig) {
    const plugin = this.getPlugin(pluginName)
    plugin.init(pluginConfig)
  }

  // ------------------------------------------
  //   Execution
  // ------------------------------------------

  getContext () {
    // TODO: Construct some useful context in future
    return {}
  }

  // Run hook for each plugin and return an array of results
  hook (hookName, ...args) {
    // TODO: Init validation my not by needed by design
    this.validate()
    const results = []
    for (const pluginName in this.plugins) {
      const plugin = this.getPlugin(pluginName)
      if (!plugin.hasHook(hookName)) continue
      const pluginResult = plugin.runHook(hookName, ...args)
      if (pluginResult != null) results.push(pluginResult)
    }
    return results
  }

  // Works the same as Array.reduce but for the list of plugins
  reduceHook (hookName, initialValue, ...args) {
    // TODO: Init validation my not by needed by design
    this.validate()
    let value = initialValue
    for (const pluginName in this.plugins) {
      const plugin = this.getPlugin(pluginName)
      if (!plugin.hasHook(hookName)) continue
      value = plugin.runHook(hookName, value, ...args)
    }
    return value
  }
}
