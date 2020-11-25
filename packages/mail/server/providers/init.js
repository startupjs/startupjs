let providers
let defaultProvider

export default function initProviders (options = {}) {
  const {
    defaultProvider: _defaultProvider,
    providers: providersConfig
  } = options

  // If no default provider passed we take
  // first provider from options as default
  defaultProvider = _defaultProvider || Object.keys(providersConfig)[0]

  providers = providersConfig
}

export function getProvider (name) {
  if (!providers) {
    throw new Error(
      '[@startupjs/mail] getProvider: initialize ' +
      'library using initMail before getting provider'
    )
  }

  if (name && !providers[name]) {
    throw new Error(
      `[@startupjs/mail] getProvider: provider: ${name} not found. ` +
      'Initialize it using initMail first.'
    )
  }

  return providers[name || defaultProvider]
}
