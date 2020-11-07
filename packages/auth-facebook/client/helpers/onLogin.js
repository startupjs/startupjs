import { LoginManager, AccessToken } from 'react-native-fbsdk'
import axios from 'axios'
import { CALLBACK_NATIVE_URL, PERMISSIONS } from '../../../isomorphic/constants'
import { BASE_URL } from '@env'

export default async function onLogin () {
  const baseUrl = BASE_URL

  try {
    // The problem was that Facebook SDK was still keeping the previous session token, and when
    // I was trying to login again I was getting this error, to solve this problem all
    // I had to do was to call the logOut method from the LoginManager.
    // https://stackoverflow.com/a/45770100/5012228
    LoginManager.logOut()
    const result = await LoginManager.logInWithPermissions(PERMISSIONS)

    if (result.isCancelled) {
      console.log('[@dmapper/auth] Facebook login cancelled')
      return
    }

    const data = await AccessToken.getCurrentAccessToken()

    await axios.post(baseUrl + CALLBACK_NATIVE_URL, data)
  } catch (error) {
    console.log('[@dmapper/auth] Error, FacebookAuth', error)
  }
}
