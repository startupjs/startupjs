import { providers, defaultProvider } from './init'

export function getProvider (name = defaultProvider) {
  if (!providers) {
    throw new Error(
      '[@startupjs/mail] getProvider: initialize ' +
      'library using initMail before getting provider'
    )
  }
  return providers[name]
}
