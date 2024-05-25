import { $root } from 'startupjs'
import { CookieManager } from '@startupjs/auth'
import { BASE_URL } from '@env'
import moment from 'moment'
import qs from 'qs'
import { WEB_LOGIN_URL } from '../../isomorphic'

export default async function onLogin ({
  baseUrl = BASE_URL,
  redirectUrl,
  ...options
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

  const serializedOptions = qs.stringify(options, { addQueryPrefix: true })

  window.location.href = serializedOptions ? WEB_LOGIN_URL + serializedOptions : WEB_LOGIN_URL
}
