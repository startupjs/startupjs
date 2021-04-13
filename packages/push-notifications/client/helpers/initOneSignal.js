import OneSignal from 'react-native-onesignal'
import axios from 'axios'
import { GET_APP_ID } from '../../isomorphic'

export default async function initOneSignal (useInit) {
  const appId = await getOneSignalAppId()
  await OneSignal.setAppId(appId)

  useInit && useInit()
}

async function getOneSignalAppId () {
  try {
    const response = await axios.get(GET_APP_ID)
    return response.data
  } catch (err) {
    throw new Error(err.response.data)
  }
}
