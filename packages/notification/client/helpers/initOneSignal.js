import OneSignal from 'react-native-onesignal'
import axios from 'axios'
import { GET_APP_ID } from '../../isomorphic'

export default function initOneSignal ({ useInit }) {
  /* O N E S I G N A L   S E T U P */
  OneSignal.setAppId(getOneSignalAppId())

  useInit && useInit()
}

function getOneSignalAppId () {
  try {
    const response = axios.get(GET_APP_ID)
    return response.data
  } catch (err) {
    throw new Error(err.response.data)
  }
}
