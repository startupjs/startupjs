import { Linking } from 'react-native'
import { CookieManager } from '@startupjs/auth'
import { BASE_URL } from '@env'
import moment from 'moment'
import { WEB_LOGIN_URL } from '../../isomorphic'

export default async function onLogin ({
  baseUrl = BASE_URL,
  redirectUrl,
  expiresRedirectUrl,
  ...options
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

  const serializedOptions = Object.keys(options).map(key => key + '=' + options[key]).join('&')

  Linking.openURL(serializedOptions ? WEB_LOGIN_URL + `?${serializedOptions}` : WEB_LOGIN_URL)
}
