import EventEmitter from './EventEmitter.js'
import Plugin from './Plugin.js'

export default class Module extends EventEmitter {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  constructor (parentRegistry, name) {
    super()
    this.name = name
    this.registry = parentRegistry
    this.plugins = {}
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

  // ------------------------------------------
  //   Execution
  // ------------------------------------------

  // Run hook for each plugin and return an array of results
  hook (hookName, ...args) {
    const results = []
    for (const pluginName in this.plugins) {
      const plugin = this.getPlugin(pluginName)
      if (!plugin.hasHook(hookName)) continue
      const pluginResult = plugin.runHook(hookName, ...args)
      if (pluginResult != null) results.push(pluginResult)
    }
    this.emit(hookName, ...args)
    return results
  }

  // Works the same as Array.reduce but for the list of plugins
  reduceHook (hookName, initialValue, ...args) {
    let value = initialValue
    for (const pluginName in this.plugins) {
      const plugin = this.getPlugin(pluginName)
      if (!plugin.hasHook(hookName)) continue
      value = plugin.runHook(hookName, value, ...args)
    }
    return value
  }
}
