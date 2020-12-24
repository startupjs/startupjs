import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNRestart from 'react-native-restart'
import { $root } from 'startupjs'

export default async function finishAuth (redirectUrl) {
  const successRedirectUrl = redirectUrl || $root.get('$render.query.redirectUrl') ||
    $root.get('_session.auth.successRedirectUrl') || '/'

  if (Platform.OS === 'web') {
    window.location.href = successRedirectUrl
  } else {
    await AsyncStorage.setItem('successRedirectUrl', successRedirectUrl)
    RNRestart.Restart()
  }
}
