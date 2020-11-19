import BaseProvider from './BaseProvider'
import MailgunProvider from './MailgunProvider'

const PROVIDERS = {
  base: BaseProvider,
  mailgun: MailgunProvider
}

export let providers
export let defaultProvider

export default function initProviders (options = {}) {
  const {
    defaultProvider: _defaultProvider,
    providers: providersOptions
  } = options

  let _providers = {}
  const providerNames = Object.keys(providersOptions)

  // If no default provider passed then we take
  // first provider from options as default
  defaultProvider = _defaultProvider || providerNames[0]

  for (let providerName of providerNames) {
    _providers[providerName] = _initProvider(
      providerName,
      providersOptions[providerName]
    )
  }
  providers = _providers
}

function _initProvider (name, options = {}) {
  const Provider = PROVIDERS[name]
  if (!Provider) {
    throw new Error(`[@startupjs/mail] _initProvider: provider (${name}) does not exists!`)
  }
  const instance = new Provider(options)
  return instance
}
