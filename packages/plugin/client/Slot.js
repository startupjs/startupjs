import React from 'react'
import { observer } from 'startupjs'
import { usePlugins, useOptions } from './PluginsProvider'

export default observer(function Slot ({
  name,
  children = null,
  ...props
}) {
  const plugins = usePlugins()
  const options = useOptions()

  return plugins.reduce((recursiveChildren, pluginStructure) => {
    const Component = pluginStructure[name]
    const pluginOptions = options[pluginStructure.name]

    // TODO: memo pluginOptions
    if (Component) {
      return pug`
        Component(
          options=pluginOptions
          ...props
        )= recursiveChildren
      `
    }

    return recursiveChildren
  }, children)
})
