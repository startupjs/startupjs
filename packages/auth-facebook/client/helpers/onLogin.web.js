import { Linking } from 'react-native'
import { $root } from 'startupjs'
import { CookieManager } from '@startupjs/auth'
import { BASE_URL } from '@env'
import moment from 'moment'
import { WEB_LOGIN_URL } from '../../isomorphic'

export default async function onLogin ({
  baseUrl = BASE_URL,
  redirectUrl
} = {}) {
  const expiresRedirectUrl = $root.get('_session.auth.expiresRedirectUrl')

  // set redirectUrl in cookie and play redirect from server
  if (redirectUrl) {
    CookieManager.set({
      baseUrl,
      name: 'authRedirectUrl',
      value: redirectUrl,
      expires: moment().add(expiresRedirectUrl, 'milliseconds')
    })
  }

  Lwindow.location.href = WEB_LOGIN_URL
}
