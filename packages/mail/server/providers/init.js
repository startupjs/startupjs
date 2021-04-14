import _config from '../config'

export default function initProviders (options = {}) {
  const {
    defaultProvider,
    providers
  } = options

  if (!providers) {
    throw new Error(
      '[@startupjs/mail] initProviders: providers is required'
    )
  }

  _config.defaultProvider = defaultProvider || Object.keys(providers)[0]

  _config.providers = providers
}

export function getProvider (name = _config.defaultProvider) {
  if (!_config.providers) {
    throw new Error(
      '[@startupjs/mail] getProvider: initialize ' +
      'library using initMail before getting provider'
    )
  }

  if (!_config.providers[name]) {
    throw new Error(
      `[@startupjs/mail] getProvider: provider: ${name} not found. ` +
      'Initialize it using initMail first.'
    )
  }

  return _config.providers[name || _config.defaultProvider]
}
