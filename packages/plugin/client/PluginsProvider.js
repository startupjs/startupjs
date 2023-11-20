import React, { useMemo } from 'react'
import { pug } from 'startupjs'
import pluginsSingleton from './pluginsSingleton'
import PluginsContext from './context'

export function PluginsProvider ({
  moduleName,
  plugins = {},
  children
}) {
  // do nothing when no registered plugins
  if (!pluginsSingleton.modules) return children

  if (!moduleName) {
    throw new Error(
      '[@startupjs/plugin] PluginsProvider: property \'moduleName\' is required'
    )
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const value = useMemo(() => {
    let _plugins = {}
    // transform an array into an object
    // because property 'plugins' can be both types
    if (Array.isArray(plugins)) {
      for (const plugin of plugins) {
        // a way to skip plugins with 'defaultEnabled'
        _plugins[plugin.name] = plugin.enabled === false
          ? false
          : plugin.options || true
      }
    } else {
      // otherwise it is already an object
      _plugins = plugins
    }

    const aModule = pluginsSingleton.modules[moduleName]
    const defaultEnabledNames = aModule?.defaultEnabledNames || []
    const displayedPlugins = []

    // display 'defaultEnabled' plugins first
    for (const defaultEnabledName of defaultEnabledNames) {
      const options = _plugins[defaultEnabledName]
      // a way to skip plugins with 'defaultEnabled'
      if (options === false) continue
      displayedPlugins.push({ name: defaultEnabledName, options })
    }

    // then display plugins passed to provider
    for (const [pluginName, options] of Object.entries(_plugins)) {
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
