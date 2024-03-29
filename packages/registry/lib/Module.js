// TODO: Maybe use a simple native implementation in future.
//       Problem was that EventTarget was not available in expo on android
// import EventEmitter from './EventEmitter.js'
import EventEmitter from './FbEventEmitter.js'
import Plugin from './Plugin.js'
import sortPlugins from './sortPlugins.js'

export default class Module extends EventEmitter {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  _options = {}
  _allPlugins = {} // all plugins added to the module (including disabled ones)
  _pendingInitArgs = undefined
  initHookTriggered = false
  plugins = {} // when you call plugin.enable() it moves from _allPlugins to plugins
  created = false
  initialized = false
  enabled = false

  constructor (parentRegistry, name) {
    super()
    this.name = name
    this.registry = parentRegistry
  }

  // this method provides support for extremely late binding of plugins and works as
  // a factory for singletons (plugins are singletons)
  getPlugin (pluginName) {
    if (!pluginName) throw Error('[@startupjs/registry] You must pass plugin name into getPlugin()')
    if (!this._allPlugins[pluginName]) {
      this._allPlugins[pluginName] = this.newPlugin(this, pluginName)
    }
    return this._allPlugins[pluginName]
  }

  enablePlugin (pluginName) {
    if (typeof pluginName !== 'string') pluginName = pluginName.name
    // can enable multiple times, just ignore subsequent calls
    if (this.plugins[pluginName]) return
    const plugin = this._allPlugins[pluginName]
    if (!plugin) throw Error(`[@startupjs/registry] Plugin "${pluginName}" for module "${this.name}" is not found`)
    this.plugins[pluginName] = plugin
    plugin.enable()
  }

  disablePlugin (pluginName) {
    if (typeof pluginName !== 'string') pluginName = pluginName.name
    // can disable multiple times, just ignore subsequent calls
    if (!this.plugins[pluginName]) return
    const plugin = this.plugins[pluginName]
    delete this.plugins[pluginName]
    plugin.disable()
  }

  newPlugin (...args) {
    return new Plugin(...args)
  }

  get options () {
    if (!this.initialized) throw Error(`Module "${this.name}" is not initialized yet`)
    return this._options
  }

  create () {
    if (this.created) throw Error(`Module "${this.name}" already created`)
    this.created = true
    return this
  }

  enable () {
    if (this.enabled) return this // module can be enabled multiple times (we just ignore subsequent calls)
    this.enabled = true
    this.registry.enableModule(this)

    // delayed initialization
    if (this._pendingInitArgs) {
      const args = this._pendingInitArgs
      delete this._pendingInitArgs
      this.init(...args)
      this.triggerInitHook()
    }

    return this
  }

  disable () {
    if (!this.enabled) return this // module can be disabled multiple times (we just ignore subsequent calls)
    this.enabled = false
    this.registry.disableModule(this)
    return this
  }

  beforeInit (moduleOptions) {}

  init (optionsByEnv = {}) {
    if (!this.created) throw Error(`Module "${this.name}" is not created (no createModule() was called yet)`)
    if (this.initialized) throw Error(`Module "${this.name}" already initialized`)
    this.initialized = true
    for (const env in optionsByEnv) {
      const {
        init,
        ...options
      } = optionsByEnv[env] || {}
      Object.assign(this.options, options)
      const hooks = init?.call(this, options, this)
      if (typeof hooks === 'object') {
        for (const hookName in hooks) this.on(hookName, hooks[hookName])
      }
    }
    return this
  }

  // in case module is not enabled yet, we store the args and init the module later if it ever gets enabled
  delayInit (...args) {
    this._pendingInitArgs = args
  }

  triggerInitHook () {
    if (this.initHookTriggered) return
    this.initHookTriggered = true
    this.hook('init')
  }

  // ------------------------------------------
  //   Execution
  // ------------------------------------------

  // Run hook for each plugin and return an array of results
  hook (hookName, ...args) {
    this.emit(hookName, ...args)
    const results = []
    const enabledPlugins = this.sortPlugins(Object.keys(this.plugins))
    for (const pluginName of enabledPlugins) {
      const plugin = this.plugins[pluginName]
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
    const enabledPlugins = this.sortPlugins(Object.keys(this.plugins))
    for (const pluginName of enabledPlugins) {
      const plugin = this.plugins[pluginName]
      if (!plugin.hasHook(hookName)) continue
      const res = plugin.runHook(hookName, value, ...args)
      if (typeof res === 'undefined') throw Error(ERRORS.noReturnValue(pluginName, hookName))
      // support escaping the chain by explicitly returning `null`
      if (res === null) break
      value = res
    }
    return value
  }

  sortPlugins (pluginNames) {
    return sortPlugins(pluginNames, pluginName => this._allPlugins[pluginName].config.order)
  }

  toString () {
    return this.name
  }
}

const ERRORS = {
  noReturnValue: (pluginName, hookName) => `
    Plugin "${pluginName}" did not return any value for reduceHook "${hookName}".
    This will break the chain of hooks. Make sure to always return a value from a hook.

    If for some reason you want to break the chain, return \`null\` explicitly
    and this will break the chain without throwing an error.
  `
}
