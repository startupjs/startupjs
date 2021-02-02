import { appleAuth } from '@invertase/react-native-apple-authentication'
import { finishAuth } from '@startupjs/auth'
import axios from 'axios'
import { CALLBACK_NATIVE_URL } from '../../isomorphic'

export default async function onLogin ({ baseUrl }) {
  try {
    const data = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
    })

    await axios.post(baseUrl + CALLBACK_NATIVE_URL, {
      id: data.user,
      email: data.email,
      fullName: data.fullName
    })

    finishAuth()
  } catch (err) {
    console.log(err)
  }
}
