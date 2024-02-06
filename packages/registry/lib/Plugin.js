export default class Plugin {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  _options = {}
  _optionsByEnv = {}
  _hooks = {}
  initsByEnv = {}
  order = undefined
  created = false
  initialized = false
  enabled = false

  constructor (parentModule, name) {
    this.name = name
    this.module = parentModule
  }

  get options () {
    if (!this.initialized) throw ERRORS.notInitialized(this)
    return this._options
  }

  get optionsByEnv () {
    if (!this.initialized) throw ERRORS.notInitialized(this)
    return this._optionsByEnv
  }

  get hooks () {
    if (!this.initialized) throw ERRORS.notInitialized(this)
    return this._hooks
  }

  create ({ order, enabled, ...initsByEnv } = {}) {
    if (this.created) throw ERRORS.alreadyCreated(this)
    this.order = order
    Object.assign(this.initsByEnv, initsByEnv)
    this.created = true
    if (enabled) this.enable()
    return this
  }

  enable () {
    if (this.enabled) return // plugin can be enabled multiple times (we just ignore subsequent calls)
    this.enabled = true
    this.module.enablePlugin(this)
    return this
  }

  disable () {
    if (!this.enabled) return // plugin can be disabled multiple times (we just ignore subsequent calls)
    this.enabled = false
    this.module.disablePlugin(this)
    return this
  }

  init (optionsByEnv = {}) {
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
    '(no plugin.create() was executed for this plugin)'),
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
