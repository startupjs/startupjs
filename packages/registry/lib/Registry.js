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
  autoEnableWithOptions = true
  initialized = false

  constructor ({ rootModuleName = 'root' } = {}) {
    this.rootModule = this.getModule(rootModuleName)
    this.rootModule.create()
    this.rootModule.enable()
  }

  // this method provides support for extremely late binding of modules and works as
  // a factory for singletons (modules are singletons)
  getModule (moduleName) {
    if (!moduleName) throw Error('[@startupjs/registry] You must pass module name into getModule()')
    if (!this._allModules[moduleName]) {
      this._allModules[moduleName] = this.newModule(this, moduleName)
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
    // automatically enable modules and plugins which have options specified
    this.autoEnableWithOptions = rootModuleOptions?.isomorphic?.autoEnableWithOptions ?? this.autoEnableWithOptions

    // load modules which might not have been created yet (code didn't reach `createModule` yet)
    // TODO: This is temporarily. We should implement the same logic as for plugins.
    //       We should auto-load .module.js files which have createModule() calls in them.
    //       For now the modules don't actually hold any config, so as a temporary solution
    //       we don't need to bother with this.
    //       Later on .getModule() should NOT automatically run .create() and automatically enable the module
    for (const moduleName in modulesOptions) {
      this.getModule(moduleName)
    }

    // init modules
    for (const moduleName in this._allModules) {
      const _module = this._allModules[moduleName]
      // for now we just auto-create module ourselves if it's not created yet
      if (!_module.created) _module.create()
      // for now we auto-enable any module by default. In future we'll have it disabled by default
      if (!_module.enabled) _module.enable()

      const moduleOptions = this.findOptionsForModule({
        moduleName, modulesOptions, rootModuleOptions
      })
      _module.beforeInit(moduleOptions)
      if (_module.enabled) {
        _module.init(moduleOptions)
      } else {
        _module.delayInit(moduleOptions)
      }
    }

    // init plugins
    const handledPlugins = new Set()
    for (const moduleName in this.modules) {
      const allPlugins = this.modules[moduleName]._allPlugins
      for (const pluginName in allPlugins) {
        const plugin = allPlugins[pluginName]
        const [fullPluginName, pluginOptions] = this.findOptionsForPlugin({
          moduleName, pluginName, pluginsOptions
        })
        plugin.beforeInit(pluginOptions)
        if (fullPluginName) handledPlugins.add(fullPluginName)
        if (plugin.enabled) {
          plugin.init(pluginOptions)
        } else {
          plugin.delayInit(pluginOptions)
        }
      }
    }

    // Check if there are any plugins options which were not used
    const unusedPluginsOptions = Object.keys(pluginsOptions)
      .filter(pluginOptionsName => !handledPlugins.has(pluginOptionsName))
    if (unusedPluginsOptions.length) {
      throw Error('[@startupjs/registry] You\'ve specified options for plugins which ' +
        'are not present in the registry.\nYou\'ve probably forgot to import these plugins into the project:' +
        unusedPluginsOptions.join('\n  - ')
      )
    }

    // trigger init hook on all enabled modules
    for (const moduleName in this.modules) {
      const _module = this.modules[moduleName]
      _module.triggerInitHook()
    }
  }

  // full plugin name is 'moduleName/pluginName'
  findOptionsForPlugin ({ pluginsOptions, moduleName, pluginName }) {
    let pluginOptionsName
    // plugin for the root module might be specified as 'pluginName' instead of 'rootModuleName/pluginName'
    if (moduleName === this.rootModule.name && pluginsOptions[pluginName]) {
      pluginOptionsName = pluginName
    } else if (pluginsOptions[`${moduleName}/${pluginName}`]) {
      pluginOptionsName = `${moduleName}/${pluginName}`
    }
    return [pluginOptionsName, pluginsOptions[pluginOptionsName]]
  }

  findOptionsForModule ({ moduleName, modulesOptions, rootModuleOptions }) {
    if (moduleName === this.rootModule.name) {
      if (modulesOptions[this.rootModule.name]) {
        throw Error(`[@startupjs/registry] Options for the root module "${this.rootModule.name}" ` +
          'should be specified in the root of the options object, not under "modules" key')
      }
      return rootModuleOptions
    }
    return modulesOptions[moduleName]
  }
}
