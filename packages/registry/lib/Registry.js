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
  init ({
    plugins: pluginsOptions = {},
    modules: modulesOptions = {},
    ...rootModuleOptions
  } = {}) {
    if (this.initialized) throw Error('[@startupjs/registry] Registry already initialized')
    const { isomorphic: { allowUnusedPlugins } = {} } = rootModuleOptions

    // create modules which might not have been created yet (code didn't reach `createModule` yet)
    for (const moduleName in modulesOptions) this.getModule(moduleName)
    // create root module in case its `createModule` was not called yet
    this.getModule(this.rootModuleName)

    // init modules
    for (const moduleName in this.modules) {
      const moduleOptions = findOptionsForModule({
        moduleName, modulesOptions, rootModuleOptions, rootModuleName: this.rootModuleName
      })
      this.modules[moduleName].init(moduleOptions)
    }

    // init plugins
    const handledPlugins = new Set()
    for (const moduleName in this.modules) {
      const plugins = this.modules[moduleName].plugins
      for (const pluginName in plugins) {
        const plugin = plugins[pluginName]
        const [fullPluginName, pluginOptions = {}] = findOptionsForPlugin({
          moduleName, pluginName, pluginsOptions, rootModuleName: this.rootModuleName
        })
        if (fullPluginName) handledPlugins.add(fullPluginName)
        // always init plugin even if options are not specified
        plugin.init(pluginOptions)
      }
    }
    if (!allowUnusedPlugins) {
      // Check if there are any plugins options which were not used
      const unusedPluginsOptions = Object.keys(pluginsOptions)
        .filter(pluginOptionsName => !handledPlugins.has(pluginOptionsName))
      if (unusedPluginsOptions.length) {
        throw Error('[@startupjs/registry] You\'ve specified options for plugins which ' +
          'are not present in the registry.\nYou\'ve probably forgot to import these plugins into the project:' +
          unusedPluginsOptions.join('\n  - ')
        )
      }
    }
  }
}

// full plugin name is 'moduleName/pluginName'
function findOptionsForPlugin ({ pluginsOptions, moduleName, pluginName, rootModuleName }) {
  let pluginOptionsName
  // plugin for the root module might be specified as 'pluginName' instead of 'rootModuleName/pluginName'
  if (moduleName === rootModuleName && pluginsOptions[pluginName]) {
    pluginOptionsName = pluginName
  } else if (pluginsOptions[`${moduleName}/${pluginName}`]) {
    pluginOptionsName = `${moduleName}/${pluginName}`
  }
  return [pluginOptionsName, pluginsOptions[pluginOptionsName]]
}

function findOptionsForModule ({ moduleName, modulesOptions, rootModuleOptions, rootModuleName }) {
  if (moduleName === rootModuleName) {
    if (modulesOptions[rootModuleName]) {
      throw Error(`[@startupjs/registry] Options for the root module "${rootModuleName}" ` +
        'should be specified in the root of the options object, not under "modules" key')
    }
    return rootModuleOptions
  }
  return modulesOptions[moduleName]
}
