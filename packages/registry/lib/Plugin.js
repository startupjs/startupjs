export default class Plugin {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  _options = {}
  _optionsByEnv = {}
  _hooks = {}
  initialized = false
  created = false
  initsByEnv = {}

  constructor (parentModule, name) {
    this.name = name
    this.module = parentModule
  }

  create (initsByEnv = {}) {
    if (this.created) throw Error(`Plugin "${this.name}" for module "${this.module.name}" already created`)
    Object.assign(this.initsByEnv, initsByEnv)
    this.created = true
  }

  get options () {
    if (!this.initialized) throw Error(`Plugin "${this.name}" for module "${this.module.name}" is not initialized yet`)
    return this._options
  }

  get optionsByEnv () {
    if (!this.initialized) throw Error(`Plugin "${this.name}" for module "${this.module.name}" is not initialized yet`)
    return this._optionsByEnv
  }

  get hooks () {
    if (!this.initialized) throw Error(`Plugin "${this.name}" for module "${this.module.name}" is not initialized yet`)
    return this._hooks
  }

  init (optionsByEnv = {}) {
    if (this.initialized) throw Error(`Plugin "${this.name}" for module "${this.module.name}" already registered`)
    this.initialized = true
    Object.assign(this.optionsByEnv, optionsByEnv)
    for (const env in this.initsByEnv) {
      const options = this.optionsByEnv[env] || {}
      const init = this.initsByEnv[env]
      if (typeof init !== 'function') {
        throw Error(`Plugin "${this.name}" for module "${this.module.name}" is not a function`)
      }
      Object.assign(this.hooks, init(options, this))
    }
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
    if (!this.created) {
      throw Error(`Plugin "${this.name}" for module "${this.module.name}" is not created ` +
        '(no createPlugin() was executed for this plugin)')
    }
    if (!this.initialized) throw Error(`Plugin "${this.name}" for module "${this.module.name}" is not initialized`)
    if (!this.hasHook(hookName)) {
      throw Error(`
        No such hook exists:
          Module: ${this.module.name}
          Plugin: ${this.name}
          Hook: ${hookName}
      `)
    }
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
