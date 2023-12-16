import Plugin from '../lib/Plugin.js'

export default class ClientPlugin extends Plugin {
  // Run hook if it exists in config
  runDynamicHook (dynamicConfig, hookName, ...args) {
    this.validateHook(hookName)
    const usedConfig = dynamicConfig || this.config
    return usedConfig[hookName].apply(this.getContext(), args)
  }

  getDynamicConfig (dynamicOptions = {}) {
    if (dynamicOptions === true) dynamicOptions = {}
    const dynamicConfig = {}
    if (!this.initialized) {
      throw Error(`
        Plugin "${this.module.name}/${this.name}":
        can't generate dynamic config before static initialization of this plugin is done
      `)
    }
    for (const env in this.envInits) {
      const options = Object.assign({}, this.envOptions[env] || {}, dynamicOptions)
      const init = this.envInits[env]
      Object.assign(dynamicConfig, init(options, this))
    }
    return dynamicConfig
  }
}
