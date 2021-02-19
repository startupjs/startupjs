import { useMemo } from 'react'
import { useLocal } from 'startupjs'
import _merge from 'lodash/merge'

export default function useComponentPlugins (componentName, pluginsOptions) {
  let [defaultPlugins = []] = useLocal('_plugins.defaults.' + componentName)

  const finalPlugins = useMemo(() => {
    let filterPlugins = defaultPlugins.filter(plugin => {
      if (plugin.defaultEnable && !pluginsOptions[plugin.name]) return true
      if (plugin.defaultEnable && pluginsOptions[plugin.name]) return true
      if (!plugin.defaultEnable && pluginsOptions[plugin.name]) return true
      return false
    })

    return filterPlugins.map(plugin => {
      const finalOptions = _merge(
        plugin.defaultOptions,
        pluginsOptions[plugin.name]
      )

      return plugin.func(finalOptions)
    })
  }, [JSON.stringify(pluginsOptions)])

  return [finalPlugins]
}
