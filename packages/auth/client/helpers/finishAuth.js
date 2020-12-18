import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNRestart from 'react-native-restart'
import { $root } from 'startupjs'

export default async function finishAuth () {
  const successRedirectUrl = $root.get('_session.auth.successRedirectUrl') || '/'

  if (Platform.OS === 'web') {
    window.location.pathname = successRedirectUrl
  } else {
    await AsyncStorage.setItem('successRedirectUrl', successRedirectUrl)
    RNRestart.Restart()
  }
}
