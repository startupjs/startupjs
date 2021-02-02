import RNRestart from 'react-native-restart'
import { BASE_URL } from '@env'
import axios from 'axios'
import { LOGOUT_URL } from '../../isomorphic'

export default async function onLogout (baseUrl = BASE_URL) {
  await axios.get(baseUrl + LOGOUT_URL)
  RNRestart.Restart()
}
