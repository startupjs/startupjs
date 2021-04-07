let _providers
let _defaultProvider

export default function initProviders (options = {}) {
  const {
    defaultProvider,
    providers
  } = options

  _defaultProvider = defaultProvider || Object.keys(providers)[0]

  _providers = providers
}

export function getProvider (name = _defaultProvider) {
  if (!_providers) {
    throw new Error(
      '[@startupjs/mail] getProvider: initialize ' +
      'library using initMail before getting provider'
    )
  }

  if (!_providers[name]) {
    throw new Error(
      `[@startupjs/mail] getProvider: provider: ${name} not found. ` +
      'Initialize it using initMail first.'
    )
  }

  return _providers[name || _defaultProvider]
}
