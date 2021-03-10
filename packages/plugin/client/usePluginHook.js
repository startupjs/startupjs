import { usePlugins, useOptions } from './PluginsProvider'

export default function usePluginHook () {
  const plugins = usePlugins()
  const options = useOptions()

  return function (hookName, ...args) {
    for (const plugin of plugins) {
      if (plugin[hookName]) {
        plugin[hookName].apply({ options: options[plugin.name] }, ...args)
      }
    }
  }
}
