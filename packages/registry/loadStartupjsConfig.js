import config from './startupjs.config.magic.js'
import { registry } from './index.js'

let loaded = false
let wasCustomConfig = false

export default function loadStartupjsConfig (customConfig) {
  if (loaded) {
    if (wasCustomConfig) {
      // Silently ignore second attempt to load the default config if the first one was with custom config.
      // This is to support the case when the user manually runs loadStartupjsConfig() with custom config
      if (!customConfig) return
      throw Error('[@startupjs/registry] Config was already loaded manually with custom config')
    }
    throw Error('[@startupjs/registry] Config was already loaded')
  }
  if (customConfig) wasCustomConfig = true
  loaded = true
  registry.init(customConfig || config || {})
}
