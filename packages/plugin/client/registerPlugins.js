import isPlainObject from 'lodash/isPlainObject'
import pluginsSingleton from './pluginsSingleton'

export default function registerPlugins (plugins = {}) {
  if (pluginsSingleton._initialized) {
    throw new Error(
      '[@startupjs/plugin] registerPlugins: plugins already initialized.'
    )
  }

  const modules = {}

  for (const [moduleName, modulePlugins] of Object.entries(plugins)) {
    const defaultEnabledNames = []

    modules[moduleName] = { plugins: {} }

    for (const modulePlugin of modulePlugins) {
      let plugin
      let options = {}

      if (isPlainObject(modulePlugin)) {
        plugin = modulePlugin
      } else if (Array.isArray(modulePlugin)) {
        [plugin, options] = modulePlugin
      }

      if (!plugin.name) {
        console.error(
          '[@startupjs/plugin] registerPlugins: some plugins were skipped, ' +
          'because they don\'t have a \'name\' field.'
        )
        continue
      }

      if (options.defaultEnabled) defaultEnabledNames.push(plugin.name)
      modules[moduleName].plugins[plugin.name] = { plugin, options }
    }

    modules[moduleName].defaultEnabledNames = defaultEnabledNames
  }

  pluginsSingleton._initialized = true
  pluginsSingleton.modules = modules
  pluginsSingleton._raw = plugins
}
