import { Linking } from 'react-native'
import { CookieManager } from '@startupjs/auth'
import { BASE_URL } from '@env'
import moment from 'moment'
import { LINKEDIN_WEB_LOGIN_URL } from '../../isomorphic'

export default async function onLogin ({
  baseUrl = BASE_URL,
  redirectUrl,
  expiresRedirectUrl
}) {
  // set redirectUrl in cookie and play redirect from server
  if (redirectUrl) {
    CookieManager.set({
      baseUrl,
      name: 'authRedirectUrl',
      value: redirectUrl,
      expires: moment().add(expiresRedirectUrl, 'milliseconds')
    })
  }

  window.location.href = LINKEDIN_WEB_LOGIN_URL
}
