// will import: { ... }
import projectConfig from './virtual/startupjs.config.virtual.js'
import models from 'teamplay/file-based-models'
// will import: [$1, $2, $3, ...]
import plugins from './virtual/startupjs.plugins.virtual.js'
// { enableServer: true }
import features from './virtual/startupjs.features.virtual.js'
import { initRegistry } from './index.js'

let loaded = false
let wasManualConfig = false

export default function loadStartupjsConfig (config) {
  if (loaded) {
    if (wasManualConfig) {
      // Silently ignore second attempt to load the default config if the first one was with custom config.
      // This is to support the case when the user manually runs loadStartupjsConfig() with custom config
      if (!config) return
      throw Error('[@startupjs/registry] Config was already loaded manually with custom config')
    }
    throw Error('[@startupjs/registry] Config was already loaded')
  }
  if (config) wasManualConfig = true
  loaded = true

  config = config || projectConfig || {}

  config.features ??= {}
  for (const key in features) config.features[key] ??= features[key]

  // add extra meta information to the config
  initRegistry(config, { plugins, models })
}
