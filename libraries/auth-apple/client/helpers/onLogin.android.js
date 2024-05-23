import { appleAuthAndroid } from '@invertase/react-native-apple-authentication'
import { $root } from 'startupjs'
import { clientFinishAuth, CookieManager } from '@startupjs/auth'
import axios from 'axios'
import { BASE_URL } from '@env'
import moment from 'moment'
import { CALLBACK_NATIVE_URL } from '../../isomorphic'

export default async function onLogin ({
  baseUrl = BASE_URL,
  clientId,
  testBaseUrl,
  redirectUrl,
  expiresRedirectUrl
}) {
  if (redirectUrl) {
    await CookieManager.set({
      baseUrl,
      name: 'authRedirectUrl',
      value: redirectUrl,
      expires: moment().add(expiresRedirectUrl, 'milliseconds')
    })
  }

  try {
    const rawNonce = $root.id()
    const state = $root.id()

    appleAuthAndroid.configure({
      clientId,
      redirectUri: (testBaseUrl || baseUrl) + CALLBACK_NATIVE_URL,
      responseType: appleAuthAndroid.ResponseType.ALL,
      scope: appleAuthAndroid.Scope.ALL,
      nonce: rawNonce,
      state
    })

    const data = await appleAuthAndroid.signIn()
    const res = await axios.post(CALLBACK_NATIVE_URL, data)

    clientFinishAuth(res.request.responseURL.replace(testBaseUrl || baseUrl, ''))
  } catch (err) {
    console.log(err)
  }
}
