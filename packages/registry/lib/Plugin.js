export default class Plugin {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  constructor (parentModule, name) {
    this.name = name
    this.module = parentModule
    this.initialized = false
    this.created = false
  }

  create (envInits = {}) {
    if (this.created) throw Error(`Plugin "${this.name}" for module "${this.module.name}" already created`)
    this.envInits = envInits
    this.created = true
  }

  init (envOptions = {}) {
    if (this.initialized) throw Error(`Plugin "${this.name}" for module "${this.module.name}" already registered`)
    this.envOptions = envOptions
    this.config = {}
    for (const env in this.envInits) {
      const options = this.envOptions[env] || {}
      const init = this.envInits[env]
      if (typeof init !== 'function') {
        throw Error(`Plugin "${this.name}" for module "${this.module.name}" is not a function`)
      }
      Object.assign(this.config, init(options, this))
    }
    this.initialized = true
  }

  validate () {
    if (!this.created) {
      throw Error(`Plugin "${this.name}" for module "${this.module.name}" is not created ` +
        '(no createPlugin() was executed for this plugin)')
    }
    if (!this.initialized) throw Error(`Plugin "${this.name}" for module "${this.module.name}" is not initialized`)
  }

  // ------------------------------------------
  //   Execution
  // ------------------------------------------

  // Run hook if it exists in config
  runHook (hookName, ...args) {
    this.validateHook(hookName)
    // TODO: Pass current context as `this`
    return this.config[hookName].apply(this.getContext(), args)
  }

  validateHook (hookName) {
    this.validate()
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
    return Boolean(this.config?.[hookName])
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
