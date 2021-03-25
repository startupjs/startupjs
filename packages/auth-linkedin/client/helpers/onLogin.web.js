import { Linking } from 'react-native'
import { CookieManager } from '@startupjs/auth'
import { LINKEDIN_WEB_LOGIN_URL } from '../../isomorphic'

export default async function onLogin ({ redirectUrl }) {
  // set redirectUrl in cookie and play redirect from server
  if (redirectUrl) {
    CookieManager.set({ name: 'redirectUrl', value: redirectUrl })
  }

  Linking.openURL(LINKEDIN_WEB_LOGIN_URL)
}
