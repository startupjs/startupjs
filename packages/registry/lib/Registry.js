// Module is something which provides an API to extend.
// Module can only be registered once.
// Plugin is something which extends a specific module's API.
// There might be multiple plugins active for a single module.
import Module from './Module.js'

export default class Registry {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  _allModules = {} // all modules added to the registry (including disabled ones)
  modules = {} // when you call module.enable() it moves from _allModules to modules
  initialized = false

  constructor ({ rootModuleName = 'root' } = {}) {
    this.rootModuleName = rootModuleName
  }

  // this method provides support for extremely late binding of modules and works as
  // a factory for singletons (modules are singletons)
  getModule (moduleName) {
    if (!moduleName) throw Error('[@startupjs/registry] You must pass module name into getModule()')
    if (!this._allModules[moduleName]) {
      const _module = this.newModule(this, moduleName)
      // for now we just create module immediately. In future we might want to delay this
      // if modules would support some initialization logic or extra runtime options
      _module.create()
      this._allModules[moduleName] = _module
      // for now we auto-enable any module by default. In future we'll probably keep them disabled
      _module.enable()
    }
    return this._allModules[moduleName]
  }

  enableModule (moduleName) {
    if (typeof moduleName !== 'string') moduleName = moduleName.name
    // can enable multiple times, just ignore subsequent calls
    if (this.modules[moduleName]) return
    const _module = this._allModules[moduleName]
    if (!_module) throw Error(`[@startupjs/registry] Module "${moduleName}" is not found`)
    this.modules[moduleName] = _module
    _module.enable()
  }

  disableModule (moduleName) {
    if (typeof moduleName !== 'string') moduleName = moduleName.name
    // can disable multiple times, just ignore subsequent calls
    if (!this.modules[moduleName]) return
    const _module = this.modules[moduleName]
    delete this.modules[moduleName]
    _module.disable()
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
    const {
      isomorphic: {
        // automatically enable modules and plugins which have options specified
        autoEnableWithOptions = true
      } = {}
    } = rootModuleOptions

    // create modules which might not have been created yet (code didn't reach `createModule` yet)
    for (const moduleName in modulesOptions) this.getModule(moduleName)
    // create root module in case its `createModule` was not called yet
    this.getModule(this.rootModuleName)

    // init modules
    for (const moduleName in this._allModules) {
      const _module = this._allModules[moduleName]
      const moduleOptions = findOptionsForModule({
        moduleName, modulesOptions, rootModuleOptions, rootModuleName: this.rootModuleName
      })
      if (autoEnableWithOptions && moduleOptions) _module.enable()
      if (!_module.enabled) continue
      _module.init(moduleOptions)
    }

    // init plugins
    const handledPlugins = new Set()
    for (const moduleName in this.modules) {
      const allPlugins = this.modules[moduleName]._allPlugins
      for (const pluginName in allPlugins) {
        const plugin = allPlugins[pluginName]
        let [fullPluginName, pluginOptions] = findOptionsForPlugin({
          moduleName, pluginName, pluginsOptions, rootModuleName: this.rootModuleName
        })
        if (pluginOptions === true) {
          plugin.enable()
          pluginOptions = {}
        }
        if (autoEnableWithOptions && pluginOptions) plugin.enable()
        if (pluginOptions === false) {
          plugin.disable()
          pluginOptions = {}
        }
        if (!plugin.enabled) continue
        if (fullPluginName) handledPlugins.add(fullPluginName)
        // always init plugin even if options are not specified
        plugin.init(pluginOptions)
      }
    }
    if (!autoEnableWithOptions) {
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
