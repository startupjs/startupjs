import pluginsSingleton from './pluginsSingleton'

export default function registerPlugins (plugins) {
  if (pluginsSingleton.plugins) {
    throw new Error(
      '[@startupjs/plugin] registerPlugins: plugins already registered'
    )
  }

  pluginsSingleton.plugins = plugins
}
