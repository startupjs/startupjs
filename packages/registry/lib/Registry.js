// Module is something which provides an API to extend.
// Module can only be registered once.
// Plugin is something which extends a specific module's API.
// There might be multiple plugins active for a single module.
const Module = require('./Module')

module.exports = class Registry {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  constructor ({ env } = {}) {
    if (!env) throw Error('You must specify \'env\' when creating a registry')
    this.env = env
    this.modules = new Map()
  }

  getModule (moduleName) {
    if (typeof moduleName !== 'string') {
      moduleName = moduleName && moduleName.name
    }
    if (!moduleName) throw Error('[@startupjs/registry] You must pass the module name or the content of startupjs.json into the getModule()')
    if (!this.modules.has(moduleName)) {
      this.modules.set(moduleName, new Module(moduleName))
    }
    return this.modules.get(moduleName)
  }

  registerModule (moduleName, moduleConfig) {
    const aModule = this.getModule(moduleName)
    aModule.init(moduleConfig)
  }

  registerPlugin (moduleName, pluginName, pluginConfig) {
    const aModule = this.getModule(moduleName)
    aModule.registerPlugin(pluginName, pluginConfig)
  }
}
