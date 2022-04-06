import React, { useMemo } from 'react'
import pluginsSingleton from './pluginsSingleton'
import PluginsContext from './context'

export function PluginsProviderNew ({
  moduleName,
  plugins = {},
  children
}) {
  console.log('PluginProvider', moduleName)

  // NOTE: module is reserved word?
  const module = pluginsSingleton.modules[moduleName]

  if (!module) {
    throw new Error(
      '[@startupjs/plugin] PluginsProvider: there is no plugins ' +
      `registered for moduleName '${moduleName}'.`
    )
  }

  const value = useMemo(() => {
    const _plugins = plugins
    // transform an array into an object
    // because property 'plugins' can be both types
    if (Array.isArray(plugins)) {
      for (const plugin of plugins) {
        // a way to skip plugins with 'defaultEnabled'
        _plugins[plugin.name] = plugin.enabled === false
          ? false
          : plugin.options || true
      }

      plugins = _plugins
    }

    const defaultEnabledNames = module.defaultEnabledNames
    const displayedPlugins = []

    // display 'defaultEnabled' plugins first
    for (const defaultEnabledName of defaultEnabledNames) {
      const options = plugins[defaultEnabledName]
      // a way to skip plugins with 'defaultEnabled'
      if (options === false) continue
      displayedPlugins.push({ name: defaultEnabledName, options })
    }

    // then display plugins passed to provider
    for (const [pluginName, options] of Object.entries(plugins)) {
      if (defaultEnabledNames.includes(pluginName)) continue
      displayedPlugins.push({ name: pluginName, options })
    }

    return { moduleName, plugins: displayedPlugins }
  }, [JSON.stringify(plugins)])

  return pug`
    PluginsContext.Provider(value=value)
      = children
  `
}
