export default class Plugin {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  constructor (parentModule, name) {
    this.name = name
    this.parent = parentModule
    this.initialized = false
  }

  init (init, options = {}) {
    if (this.initialized) throw Error(`Plugin "${this.name}" for module "${this.parent.name}" already registered`)
    if (!(init && typeof init === 'function')) {
      throw Error(`Plugin "${this.name}" for module "${this.parent.name}" is missing init function`)
    }
    this.config = init(options, this)
    this.initialized = true
  }

  validate () {
    if (!this.initialized) throw Error(`Plugin "${this.name}" for module "${this.parent.name}" is not initialized`)
  }

  // ------------------------------------------
  //   Execution
  // ------------------------------------------

  getContext () {
    // TODO: Construct some useful context in future
    return {}
  }

  hasHook (hookName) {
    return Boolean(this.config[hookName])
  }

  validateHook (hookName) {
    this.validate()
    if (!this.hasHook(hookName)) {
      throw Error(`
        Hook is not defined.
          Module: ${this.parent.name}
          Plugin: ${this.name}
          Hook: ${hookName}
      `)
    }
  }

  // Run hook if it exists in config
  runHook (hookName, ...args) {
    this.validateHook(hookName)
    // TODO: Pass current context as `this`
    return this.config[hookName].apply(this.getContext(), args)
  }
}
