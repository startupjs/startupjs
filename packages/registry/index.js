/**
 * @typedef {import('./lib/Module.js').default} Module
 * @typedef {import('./lib/Plugin.js').default} Plugin
 */
import Registry from './lib/Registry.js'

export const ROOT_MODULE_NAME = 'startupjs'

const registry = new Registry()
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
 * Register plugin for a module
 * @param {string} moduleName - name of the module to extend
 * @param {string} pluginName - name of the plugin
 * @param {function} pluginInit - function that returns plugin config
 * @param {object} pluginOptions - options to pass to pluginInit
 */
export function registerPlugin (moduleName, pluginName, pluginInit, pluginOptions) {
  return registry.registerPlugin(moduleName, pluginName, pluginInit, pluginOptions)
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
export function createPlugin (props) {
  if (!props?.name) throw Error('[@startupjs/registry] Plugin "name" is required')
  if (!props?.for) props.for = ROOT_MODULE_NAME
  return registry.getModule(props.for).getPlugin(props.name)
}

/**
 * This runs basic metadata validation for the module,
 * and returns the module instance
 * @param {object} props - module props
 * @param {string} props.name - name of the module
 * @returns {Module} module instance
 */
export function createModule (props) {
  if (!props?.name) throw Error('[@startupjs/registry] Module "name" is required')
  return registry.getModule(props.name)
}

/**
 * Create a project with global configuration.
 * This is also used to initialize the registry with all the modules and plugins.
 * And a way to pass options to plugins.
 * `createProject` is also used as a marker to trigger the babel-plugin-eliminator,
 * which will keep only the code relevant for a specific env (client/server/isomorphic/build)
 * in the plugin options.
 */
export function createProject (props) {
  // TODO: Make a separate class for project which will extend Registry
  return registry
}
