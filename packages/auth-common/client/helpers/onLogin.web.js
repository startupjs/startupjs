import { Linking } from 'react-native'
import { CookieManager } from '@startupjs/auth'

export default async function onLogin ({ providerName, redirectUrl }) {
  // set redirectUrl in cookie and play redirect from server
  if (redirectUrl) {
    CookieManager.set({ name: 'redirectUrl', value: redirectUrl })
  }

  Linking.openURL(`/auth/${providerName}`)
}
