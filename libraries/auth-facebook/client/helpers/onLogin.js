import { LoginManager, AccessToken } from 'react-native-fbsdk'
import { clientFinishAuth, CookieManager } from '@startupjs/auth'
import { BASE_URL } from '@env'
import axios from 'axios'
import moment from 'moment'
import { CALLBACK_URL, PERMISSIONS } from '../../isomorphic'

export default async function onLogin ({
  baseUrl = BASE_URL,
  redirectUrl,
  expiresRedirectUrl
} = {}) {
  // set redirectUrl in cookie and play redirect from server
  if (redirectUrl) {
    await CookieManager.set({
      baseUrl,
      name: 'authRedirectUrl',
      value: redirectUrl,
      expires: moment().add(expiresRedirectUrl, 'milliseconds')
    })
  }

  try {
    // The problem was that Facebook SDK was still keeping the previous session token, and when
    // I was trying to login again I was getting this error, to solve this problem all
    // I had to do was to call the logOut method from the LoginManager.
    // https://stackoverflow.com/a/45770100/5012228
    LoginManager.logOut()
    const result = await LoginManager.logInWithPermissions(PERMISSIONS)

    if (result.isCancelled) {
      console.log('[@startupjs/auth-facebook]: login cancelled')
      return
    }

    const data = await AccessToken.getCurrentAccessToken()

    const res = await axios.get(baseUrl + CALLBACK_URL, {
      params: data
    })

    clientFinishAuth(res.request.responseURL.replace(baseUrl, ''))
  } catch (error) {
    console.log('[@startupjs/auth-facebook] Error: ', error)
  }
}
