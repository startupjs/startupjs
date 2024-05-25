import { CookieManager } from '@startupjs/auth'
import moment from 'moment'
import { BASE_URL } from '@env'
import { AZUREAD_LOGIN_URL } from '../../isomorphic'

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

  window.location.href = AZUREAD_LOGIN_URL
}