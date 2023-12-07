import Plugin from './Plugin.js'

export default class Module {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  constructor (name) {
    this.name = name
    this.plugins = new Map()
  }

  getPlugin (pluginName) {
    if (!pluginName) throw Error('[@startupjs/registry] You must pass plugin name into getPlugin()')
    if (!this.plugins.has(pluginName)) {
      this.plugins.set(pluginName, new Plugin(this, pluginName))
    }
    return this.plugins.get(pluginName)
  }

  registerPlugin (pluginName, pluginInit, pluginOptions) {
    const plugin = this.getPlugin(pluginName)
    plugin.init(pluginInit, pluginOptions)
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
