import jsPlugin from './jsPlugin.js'
import stylPlugin from './stylPlugin.js'
import configPlugin from './configPlugin.js'
import observerPlugin from './observerPlugin.js'
import htmlPlugin from './htmlPlugin.js'

export default function viteTransformStartupjs (options) {
  return [
    configPlugin(),
    htmlPlugin(),
    observerPlugin(),
    jsPlugin(options),
    stylPlugin()
  ]
}
