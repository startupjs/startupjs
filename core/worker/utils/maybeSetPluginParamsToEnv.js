import { getPlugin } from '@startupjs/registry'

function maybeSetPluginParamsToEnv () {
  const pluginParams = getPlugin('worker').optionsByEnv.server

  for (const param in pluginParams) {
    const constant = param
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // Insert underscore between lower & upper case
      .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // Handle cases like "XMLHttpRequest"
      .toUpperCase()

    if (process.env[constant] == null) {
      process.env[constant] = pluginParams[param]
    }
  }
}

// This is needed for the worker to work in a separate process
maybeSetPluginParamsToEnv()
