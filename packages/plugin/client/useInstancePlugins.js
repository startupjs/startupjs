import { useLocal } from 'startupjs'
import _merge from 'lodash/merge'

export default function useInstancePlugins (packageName, customOptions) {
  let [defaultPlugins = []] = useLocal('_plugins.defaults.' + packageName)

  let filterPlugins = defaultPlugins.filter(plugin => {
    if (plugin.defaultEnable && !customOptions[plugin.name]) return true
    if (plugin.defaultEnable && customOptions[plugin.name]) return true
    if (!plugin.defaultEnable && customOptions[plugin.name]) return true
    return false
  })

  // merge defaultOptions + customOptions
  const mergeOptions = filterPlugins.reduce((options, plugin) => {
    options[plugin.name] = _merge(
      plugin.defaultOptions,
      customOptions[plugin.name]
    )

    return options
  }, {})

  return [filterPlugins, mergeOptions]
}
