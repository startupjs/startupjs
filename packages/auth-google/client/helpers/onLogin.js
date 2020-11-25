import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
import { finishAuth } from '@startupjs/auth'
import { GOOGLE_CLIENT_ID, BASE_URL } from '@env'
import axios from 'axios'
import { CALLBACK_NATIVE_URL } from '../../isomorphic'

export default async function onLogin () {
  const baseUrl = BASE_URL
  const webClientId = GOOGLE_CLIENT_ID

  try {
    GoogleSignin.configure({ webClientId })

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true
    })

    const data = await GoogleSignin.signIn()

    await axios.post(baseUrl + CALLBACK_NATIVE_URL, { token: data.idToken })
    finishAuth()
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
