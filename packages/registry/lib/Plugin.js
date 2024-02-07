export default class Plugin {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  _config = {} // stuff passed to createPlugin()
  _optionsByEnv = {} // stuff passed to init()
  _hooks = {}
  _pendingInitArgs = undefined
  initsByEnv = {}
  order = undefined
  created = false
  initialized = false
  enabled = false

  constructor (parentModule, name) {
    this.name = name
    this.module = parentModule
  }

  get config () {
    if (!this.created) throw ERRORS.notCreated(this)
    return this._config
  }

  get optionsByEnv () {
    if (!this.initialized) throw ERRORS.notInitialized(this)
    return this._optionsByEnv
  }

  get hooks () {
    if (!this.initialized) throw ERRORS.notInitialized(this)
    return this._hooks
  }

  create (config = {}) {
    if (this.created) throw ERRORS.alreadyCreated(this)
    this.created = true
    const { order, enabled, ...initsByEnv } = config
    Object.assign(this.config, config)
    Object.assign(this.initsByEnv, initsByEnv)
    return this
  }

  enable () {
    if (this.enabled) return // plugin can be enabled multiple times (we just ignore subsequent calls)
    this.enabled = true
    this.module.enablePlugin(this)

    // delayed initialization
    if (this._pendingInitArgs) {
      const args = this._pendingInitArgs
      delete this._pendingInitArgs
      this.init(...args)
      // if module's 'init' hook was already triggered, we need to manually run it for this plugin
      if (this.module.initHookTriggered && this.hasHook('init')) this.runHook('init')
    }

    return this
  }

  disable () {
    if (!this.enabled) return // plugin can be disabled multiple times (we just ignore subsequent calls)
    this.enabled = false
    this.module.disablePlugin(this)
    return this
  }

  beforeInit (pluginOptions) {
    if (!this.created) throw ERRORS.notCreated(this)
    if (this._shouldEnable(pluginOptions)) this.enable()
  }

  init (optionsByEnv) {
    if (typeof optionsByEnv !== 'object') optionsByEnv = {}
    if (!this.created) throw ERRORS.notCreated(this)
    if (this.initialized) throw ERRORS.alreadyInitialized(this)
    this.initialized = true
    Object.assign(this.optionsByEnv, optionsByEnv)
    for (const env in this.initsByEnv) {
      const options = this.optionsByEnv[env] || {}
      const init = this.initsByEnv[env]
      if (typeof init !== 'function') throw ERRORS.notAFunction(this)
      Object.assign(this.hooks, init(options, this))
    }
    return this
  }

  // in case plugin is not enabled yet, we store the args and init the module later if it ever gets enabled
  delayInit (...args) {
    this._pendingInitArgs = args
  }

  _shouldEnable (pluginOptions) {
    if (pluginOptions === false) return false
    if (pluginOptions === true) return true
    const { autoEnableWithOptions } = this.module.registry
    if (autoEnableWithOptions && pluginOptions) return true
    const { enabled } = this.config
    if (enabled === true) return true
    if (typeof enabled === 'function' && enabled.apply(this, pluginOptions)) return true
    return false
  }

  // ------------------------------------------
  //   Execution
  // ------------------------------------------

  // Run hook if it exists in hooks
  runHook (hookName, ...args) {
    this.validateHook(hookName)
    // TODO: Pass current context as `this`
    return this.hooks[hookName].apply(this.getContext(), args)
  }

  validateHook (hookName) {
    if (!this.created) throw ERRORS.notCreated(this)
    if (!this.enabled) throw ERRORS.disabled(this)
    if (!this.initialized) throw ERRORS.notInitialized(this)
    if (!this.hasHook(hookName)) throw ERRORS.noSuchHook(this, hookName)
  }

  hasHook (hookName) {
    return Boolean(this.hooks?.[hookName])
  }

  getContext () {
    // TODO: Construct some useful hook execution context in future.
    //       For now just return the plugin instance itself.
    return this
  }

  // to be able to use plugin as a key in the plugins options object of registry.init()
  toString () {
    return `${this.module.name}/${this.name}`
  }
}

const ERRORS = {
  alreadyCreated: _ => Error(`Plugin "${_.name}" for module "${_.module.name}" already created.`),
  alreadyInitialized: _ => Error(`Plugin "${_.name}" for module "${_.module.name}" already initialized`),
  notCreated: _ => Error(`Plugin "${_.name}" for module "${_.module.name}" is not created ` +
    '(no createPlugin() was executed for this plugin)'),
  disabled: _ => Error(`Plugin "${_.name}" for module "${_.module.name}" is disabled. This should never happen.`),
  notInitialized: _ => Error(`Plugin "${_.name}" for module "${_.module.name}" is not initialized`),
  notAFunction: _ => Error(`Plugin "${_.name}" for module "${_.module.name}" is not a function`),
  noSuchHook: (_, hookName) => Error(`
    No such hook exists:
      Module: ${_.module.name}
      Plugin: ${_.name}
      Hook: ${hookName}
  `)
}
