import RNRestart from 'react-native-restart'
import axios from 'axios'
import { LOGOUT_URL } from '../../isomorphic'

export default async function onLogout () {
  await axios.get(LOGOUT_URL)
  RNRestart.Restart()
}
