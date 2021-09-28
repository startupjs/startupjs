import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { $root } from 'startupjs'
import { clientFinishAuth, CookieManager } from '@startupjs/auth'
import { BASE_URL } from '@env'
import axios from 'axios'
import moment from 'moment'
import { CALLBACK_URL } from '../../isomorphic'

export default async function onLogin ({
  baseUrl = BASE_URL,
  redirectUrl,
  ...options
} = {}) {
  const expiresRedirectUrl = $root.get('_session.auth.expiresRedirectUrl')

  // set redirectUrl in cookie and play redirect from server
  if (redirectUrl) {
    await CookieManager.set({
      baseUrl,
      name: 'authRedirectUrl',
      value: redirectUrl,
      expires: moment().add(expiresRedirectUrl, 'milliseconds')
    })
  }

  const webClientId = $root.get('_session.auth.google.clientId')

  try {
    GoogleSignin.configure({ webClientId, ...options })

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true
    })

    const data = await GoogleSignin.signIn()

    const res = await axios.get(baseUrl + CALLBACK_URL, {
      params: {
        token: data.idToken
      }
    })

    clientFinishAuth(res.request.responseURL.replace(baseUrl, ''))
  } catch (err) {
    if (err.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('user cancelled the login flow')
    } else if (err.code === statusCodes.IN_PROGRESS) {
      console.log('operation (f.e. sign in) is in progress already')
    } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('play services not available or outdated')
    } else {
      console.log('some error: ', err.message && err.message)
    }
  }
}
