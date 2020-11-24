import axios from 'axios'
import { NativeModules } from 'react-native'
import { LOGOUT_URL } from '../../isomorphic'

export default async function onLogout () {
  await axios.get(LOGOUT_URL)
  NativeModules.DevSettings.reload()
}
