import jsPlugin from './jsPlugin'
import stylPlugin from './stylPlugin'
import configPlugin from './configPlugin'
import observerPlugin from './observerPlugin'
import htmlPlugin from './htmlPlugin'

export default function viteTransformStartupjs (options) {
  return [
    configPlugin(),
    htmlPlugin(),
    observerPlugin(),
    jsPlugin(options),
    stylPlugin()
  ]
}
