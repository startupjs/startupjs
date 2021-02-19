import { usePlugins } from './PluginsProvider'

export default function usePluginHook () {
  const plugins = usePlugins()

  return function (hookName, ...args) {
    for (const plugin of plugins) {
      if (plugin[hookName]) plugin[hookName](...args)
    }
  }
}
