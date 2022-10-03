import React, { useContext } from 'react'
import { observer } from 'startupjs'
import merge from 'lodash/merge'
import PluginsContext from './context'
import pluginsSingleton from './pluginsSingleton'

export default observer(function Slot ({
  name,
  type = 'siblings',
  children = null,
  ...props
}) {
  if (!name) return null

  const { moduleName, plugins } = useContext(PluginsContext)
  const modulePlugins = pluginsSingleton.modules[moduleName]?.plugins

  // do nothing when no registered plugins for the module
  if (!modulePlugins) return children

  const getOptionsHook = (plugin) => {
    return function useOptions () {
      const modulePlugin = modulePlugins[plugin.name]
      return merge(
        {},
        modulePlugin.plugin.defaultOptions,
        modulePlugin.options.defaultOptions,
        plugin.options
      )
    }
  }

  // skip unregistered plugins
  const activePlugins = plugins.filter(plugin => modulePlugins[plugin.name])

  switch (type) {
    case 'siblings':
      return activePlugins.map(plugin => {
        const SlotComponent = modulePlugins[plugin.name].plugin[name]
        if (!SlotComponent) return null
        return React.createElement(
          SlotComponent,
          {
            key: `${moduleName}_${plugin.name}_${name}`,
            ...props,
            useOptions: getOptionsHook(plugin)
          }
        )
      })
    case 'nested':
      return activePlugins.slice().reverse().reduce((children, plugin) => {
        const SlotComponent = modulePlugins[plugin.name].plugin[name]
        if (!SlotComponent) return children
        return React.createElement(
          SlotComponent,
          { ...props, useOptions: getOptionsHook(plugin) },
          children
        )
      }, [children])
  }
})
