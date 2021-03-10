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

  return plugins.reduce((acc, pluginStructure) => {
    const Component = pluginStructure[name]
    const pluginOptions = options[pluginStructure.name]

    if (Component) {
      return useMemo(() => {
        return pug`
          Component(...props options=pluginOptions)= acc
        `
      }, [JSON.stringify(pluginOptions), children])
    }

    return acc
  }, children)
})
