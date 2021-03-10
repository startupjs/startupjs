import React, { useMemo } from 'react'
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

    if (Component) {
      return pug`
        WrapperComponent(
          Component=Component
          options=pluginOptions
          ...props
        )= recursiveChildren
      `
    }

    return recursiveChildren
  }, children)
})

const WrapperComponent = observer(({
  Component,
  options,
  children,
  ...props
}) => {
  return useMemo(() => pug`
    Component(options ...props)= children
  `, [JSON.stringify(options), children])
})
