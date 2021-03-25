import { Linking } from 'react-native'
import { CookieManager } from '@startupjs/auth'
import { LOGIN_URL } from '../../isomorphic'

export default async function onLogin ({ redirectUrl }) {
  // set redirectUrl in cookie and play redirect from server
  if (redirectUrl) {
    CookieManager.set({ name: 'redirectUrl', value: redirectUrl })
  }

  Linking.openURL(LOGIN_URL)
}
