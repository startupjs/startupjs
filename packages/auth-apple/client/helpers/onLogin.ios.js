import { appleAuth } from '@invertase/react-native-apple-authentication'
import { clientFinishAuth, CookieManager } from '@startupjs/auth'
import axios from 'axios'
import { BASE_URL } from '@env'
import moment from 'moment'
import { CALLBACK_NATIVE_URL } from '../../isomorphic'

export default async function onLogin ({
  baseUrl = BASE_URL,
  redirectUrl,
  expiresRedirectUrl
}) {
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
    const data = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
    })

    const res = await axios.post(baseUrl + CALLBACK_NATIVE_URL, {
      id: data.user,
      email: data.email,
      fullName: data.fullName
    })

    clientFinishAuth(res.request.responseURL.replace(baseUrl, ''))
  } catch (err) {
    console.log(err)
  }
}
