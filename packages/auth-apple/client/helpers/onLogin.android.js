import { appleAuthAndroid } from '@invertase/react-native-apple-authentication'
import { $root } from 'startupjs'
import { finishAuth } from '@startupjs/auth'
import axios from 'axios'
import { BASE_URL } from '@env'
import { CALLBACK_NATIVE_URL } from '../../isomorphic'

export default async function onLogin ({ baseUrl = BASE_URL, clientId, testBaseUrl }) {
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
    await axios.post(CALLBACK_NATIVE_URL, data)

    finishAuth()
  } catch (err) {
    console.log(err)
  }
}
