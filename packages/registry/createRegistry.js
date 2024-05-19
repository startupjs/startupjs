/**
 * @typedef {import('./lib/Module.js').default} Module
 * @typedef {import('./lib/Plugin.js').default} Plugin
 */
import { addModel } from '@startupjs/signals-orm'
import Registry from './lib/Registry.js'

// force registry to be singleton
// This is required to prevent multiple instances of registry created because of the
// import loop between registry, plugins and loadStartupjsConfig
// TODO: figure out why the loop happens and how to avoid it
let singleton

export default function createRegistry ({ RegistryClass = Registry, rootModuleName }) {
  if (singleton) return singleton

  const registry = new RegistryClass({ rootModuleName })

  return (singleton = {
    registry,

    /**
     * Alias for rootModule which is a preferred way to access it.
     * Having it start with a capital letter is useful since when
     * using client-side hooks RenderHook and RenderNestedHook
     * we can just write <MODULE.RenderHook /> and not have React
     * complain that component name can't start with the lowercase
     */
    ROOT_MODULE: registry.rootModule,

    /**
     * Get module by name
     * @param {string} moduleName - name of the module
     * @returns {Module} module instance
     */
    getModule (moduleName) {
      return registry.getModule(moduleName)
    },

    /**
     * Get plugin by name.
     * If moduleName is not specified, it will be a plugin for the root module.
     * @param {string} moduleName - name of the module
     * @param {string} pluginName - name of the plugin
     * @returns {Plugin} plugin instance
     */
    getPlugin (moduleName, pluginName) {
      if (!pluginName) {
        pluginName = moduleName
        moduleName = registry.rootModule.name
      }
      return registry.getModule(moduleName).getPlugin(pluginName)
    },

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
    createPlugin ({ name, for: _for, ...props }) {
      if (!name) throw Error('[@startupjs/registry] Plugin "name" is required')
      if (!_for) _for = registry.rootModule.name
      const plugin = registry.getModule(_for).getPlugin(name)
      plugin.create(props) // this ensures that the plugin of this name is created only once
      return plugin
    },

    /**
     * This runs basic metadata validation for the module,
     * and returns the module instance
     * @param {object} props - module props
     * @param {string} props.name - name of the module
     * @returns {Module} module instance
     */
    createModule ({ name }) {
      if (!name) throw Error('[@startupjs/registry] Module "name" is required')
      const _module = registry.getModule(name)
      return _module
    },

    /**
     * Initialize the registry with all the modules, plugins and ORM models.
     * This will also pass options to plugins.
     * This is startupjs-specific.
     */
    initRegistry (config = {}, { plugins, models = {} } = {}) {
      // TODO: only load models if 'isomorphic' env is present
      registry.init(config)
      initModels(registry, models)
      return registry
    }
  })
}

function initModels (registry, projectModels) {
  let models = { ...projectModels }
  models = registry.rootModule.reduceHook('models', projectModels)
  registry.rootModule.models = models
  for (const modelPattern in models) {
    addModel(modelPattern, models[modelPattern].default)
  }
}
