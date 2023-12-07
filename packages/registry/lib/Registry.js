// Module is something which provides an API to extend.
// Module can only be registered once.
// Plugin is something which extends a specific module's API.
// There might be multiple plugins active for a single module.
import Module from './Module.js'

export default class Registry {
  // ------------------------------------------
  //   Registration and initialization
  // ------------------------------------------

  constructor () {
    this.modules = new Map()
  }

  getModule (moduleName) {
    if (!moduleName) throw Error('[@startupjs/registry] You must pass module name into getModule()')
    if (!this.modules.has(moduleName)) {
      this.modules.set(moduleName, new Module(moduleName))
    }
    return this.modules.get(moduleName)
  }

  registerPlugin (moduleName, pluginName, pluginInit, pluginOptions) {
    const aModule = this.getModule(moduleName)
    aModule.registerPlugin(pluginName, pluginInit, pluginOptions)
  }
}
