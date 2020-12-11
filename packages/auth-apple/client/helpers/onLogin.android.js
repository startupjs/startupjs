import { appleAuthAndroid } from '@invertase/react-native-apple-authentication'
import { finishAuth } from '@startupjs/auth'
import { v4 as uuid } from 'uuid'
import axios from 'axios'
import { BASE_URL } from '@env'
import { CALLBACK_NATIVE_URL } from '../../isomorphic'

export default async function onLogin (clientId) {
  const baseUrl = BASE_URL

  try {
    const rawNonce = uuid()
    const state = uuid()

    appleAuthAndroid.configure({
      clientId,
      redirectUri: baseUrl + CALLBACK_NATIVE_URL,
      responseType: appleAuthAndroid.ResponseType.ALL,
      scope: appleAuthAndroid.Scope.ALL,
      nonce: rawNonce,
      state
    })

    const data = await appleAuthAndroid.signIn()
    await axios.post(CALLBACK_NATIVE_URL, data)

    finishAuth()
  } catch (err) {
    console.log(err)
  }
}
