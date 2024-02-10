// will import: { ... }
import config from './virtual/startupjs.config.virtual.js'
// will import: { 'users': $1, 'users.*': $2, '_session.games': $3, '_session.games.*': $4 }
import models from './virtual/startupjs.models.virtual.js'
// will import: [$1, $2, $3, ...]
import plugins from './virtual/startupjs.plugins.virtual.js'
import { initRegistry } from './index.js'

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
  initRegistry(customConfig || config || {}, { plugins, models })
}
