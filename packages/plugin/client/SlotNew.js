import React, { useContext, useCallback } from 'react'
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

  console.log('SlowNew', name)
  let { moduleName, plugins } = useContext(PluginsContext)
  const modulePlugins = pluginsSingleton.modules[moduleName].plugins

  const getOptionsHook = (plugin) => {
    return useCallback(() => {
      const modulePlugin = modulePlugins[plugin.name]
      console.log('getOptions of ' + plugin.name)
      console.log('getOptions for ' + name)
      return merge(
        {},
        modulePlugin.plugin.defaultOptions,
        modulePlugin.options.defaultOptions,
        plugin.options
      )
    }, [JSON.stringify(plugin.options)])
  }

  // skip unregistered plugins
  plugins = plugins.filter(plugin => modulePlugins[plugin.name])

  switch (type) {
    case 'siblings':
      return plugins.map(plugin => {
        const SlotComponent = modulePlugins[plugin.name].plugin[name]
        if (!SlotComponent) return null
        console.log('SlowNew render', name)
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
      return plugins.slice().reverse().reduce((children, plugin) => {
        const SlotComponent = modulePlugins[plugin.name].plugin[name]
        if (!SlotComponent) return children
        console.log('SlowNew render', name)
        return React.createElement(
          SlotComponent,
          { ...props, useOptions: getOptionsHook(plugin) },
          children
        )
      }, [children])
  }
})
