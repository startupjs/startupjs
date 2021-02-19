import React from 'react'
import { observer } from 'startupjs'
import { usePlugins } from './PluginsProvider'

export default observer(function Slot ({
  name,
  children = null,
  ...props
}) {
  const plugins = usePlugins()

  return plugins.reduce((children, plugin) => {
    const Component = plugin[name]
    return Component ? pug`Component(...props)= children` : children
  }, children)
})
