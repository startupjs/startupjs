// Module is something which provides an API to extend.
// Module can only be registered once.
// Plugin is something which extends a specific module's API.
// There might be multiple plugins active for a single module.
import Module from './Module.js'

export default class Registry {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  constructor ({ rootModuleName = 'root' } = {}) {
    this.rootModuleName = rootModuleName
    this.modules = {}
    this.initialized = false
  }

  getModule (moduleName) {
    if (!moduleName) throw Error('[@startupjs/registry] You must pass module name into getModule()')
    if (!this.modules[moduleName]) {
      this.modules[moduleName] = this.newModule(this, moduleName)
    }
    return this.modules[moduleName]
  }

  newModule (...args) {
    return new Module(...args)
  }

  // init all plugins for all modules
  init (pluginsOptions = {}) {
    const handedPluginsOptions = new Set()
    if (this.initialized) throw Error('[@startupjs/registry] Registry already initialized')
    for (const moduleName in this.modules) {
      const plugins = this.modules[moduleName].plugins
      for (const pluginName in plugins) {
        const plugin = plugins[pluginName]
        const optionsKey = findOptionsKeyForPlugin({
          pluginsOptions, moduleName, pluginName, rootModuleName: this.rootModuleName
        })
        if (optionsKey) handedPluginsOptions.add(optionsKey)
        plugin.init(pluginsOptions[optionsKey] || {})
      }
    }
    // Check if there are any plugins options which were not used
    const unusedPluginsOptions = Object.keys(pluginsOptions)
      .filter(pluginOptionsName => !handedPluginsOptions.has(pluginOptionsName))
    if (unusedPluginsOptions.length) {
      throw Error('[@startupjs/registry] You\'ve specified options for plugins which ' +
        'are not present in the registry.\nYou\'ve probably forgot to import these plugins into the project:' +
        unusedPluginsOptions.join('\n  - ')
      )
    }
  }
}

// full plugin name is 'moduleName/pluginName'
function findOptionsKeyForPlugin ({ pluginsOptions, moduleName, pluginName, rootModuleName }) {
  let pluginOptionsName
  // plugin for the root module might be specified as 'pluginName' instead of 'rootModuleName/pluginName'
  if (moduleName === rootModuleName && pluginsOptions[pluginName]) {
    pluginOptionsName = pluginName
  } else if (pluginsOptions[`${moduleName}/${pluginName}`]) {
    pluginOptionsName = `${moduleName}/${pluginName}`
  }
  return pluginOptionsName
}
