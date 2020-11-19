export let providers
export let defaultProvider

/*
config:
{
  Mailgun: {
    instance: require(...),
    options: {
      ...
    }
  }
}
*/

export default function initProviders (options = {}) {
  const {
    defaultProvider: _defaultProvider,
    providers: providersConfig
  } = options

  let _providers = {}
  const providerNames = Object.keys(providersConfig)

  // If no default provider passed then we take
  // first provider from options as default
  defaultProvider = _defaultProvider || providerNames[0]

  for (let providerName of providerNames) {
    _providers[providerName] = new providersConfig[providerName].instance(
      providersConfig[providerName].options
    )
  }

  providers = _providers
}
