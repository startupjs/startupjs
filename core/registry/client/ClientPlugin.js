import Plugin from '../lib/Plugin.js'

export default class ClientPlugin extends Plugin {
  // Run hook if it exists in config
  runDynamicHook (dynamicHooks, hookName, ...args) {
    this.validateHook(hookName)
    const hooks = dynamicHooks || this.hooks
    return hooks[hookName].apply(this, args)
  }

  getDynamicHooks (dynamicOptions = {}) {
    if (dynamicOptions === true) dynamicOptions = {}
    const dynamicHooks = {}
    if (!this.initialized) {
      throw Error(`
        Plugin "${this.module.name}/${this.name}":
        can't generate dynamic config before static initialization of this plugin is done
      `)
    }
    for (const env in this.initsByEnv) {
      const options = Object.assign({}, this.optionsByEnv[env] || {}, dynamicOptions)
      const init = this.initsByEnv[env]
      Object.assign(dynamicHooks, init.call(this, options, this))
    }
    return dynamicHooks
  }
}
