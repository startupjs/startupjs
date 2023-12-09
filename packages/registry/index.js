/**
 * @typedef {import('./lib/Module.js').default} Module
 * @typedef {import('./lib/Plugin.js').default} Plugin
 */
import Registry from './lib/Registry.js'

export const ROOT_MODULE_NAME = 'startupjs'

const registry = new Registry({ rootModuleName: ROOT_MODULE_NAME })
export default registry

export const rootModule = registry.getModule(ROOT_MODULE_NAME)

/**
 * Get module by name
 * @param {string} moduleName - name of the module
 * @returns {Module} module instance
 */
export function getModule (moduleName) {
  return registry.getModule(moduleName)
}

/**
 * This runs basic metadata validation for the plugin,
 * but it's mostly used as a marker to trigger the babel-plugin-eliminator,
 * which will keep only the code relevant for a specific env (client/server/isomorphic/build).
 * If 'for' is not specified, it will be a plugin for the root module 'startupjs'.
 * @param {object} props - plugin props
 * @param {string} props.name - name of the plugin
 * @param {string} props.for - name of the module to extend. Default: 'startupjs'
 * @param {function} props.server - function that returns server plugin config
 * @param {function} props.client - function that returns client plugin config
 * @param {function} props.isomorphic - function that returns isomorphic plugin config
 * @param {function} props.build - function that returns build plugin config
 * @returns {Plugin} plugin instance
 */
export function createPlugin ({ name, for: _for, ...envInits }) {
  if (!name) throw Error('[@startupjs/registry] Plugin "name" is required')
  if (!_for) _for = ROOT_MODULE_NAME
  const plugin = registry.getModule(_for).getPlugin(name)
  plugin.create(envInits)
  return plugin
}

/**
 * This runs basic metadata validation for the module,
 * and returns the module instance
 * @param {object} props - module props
 * @param {string} props.name - name of the module
 * @returns {Module} module instance
 */
export function createModule ({ name }) {
  if (!name) throw Error('[@startupjs/registry] Module "name" is required')
  return registry.getModule(name)
}

/**
 * Create a project with global configuration.
 * This is also used to initialize the registry with all the modules and plugins.
 * And a way to pass options to plugins.
 * `createProject` is also used as a marker to trigger the babel-plugin-eliminator,
 * which will keep only the code relevant for a specific env (client/server/isomorphic/build)
 * in the plugin options.
 */
export function createProject ({ plugins: pluginsOptions } = {}) {
  // TODO: Think whether it makes sense to make a separate class for project which will extend Registry
  registry.init(pluginsOptions)
  return registry
}
