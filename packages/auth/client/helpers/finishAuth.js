import { NativeModules, AsyncStorage, Platform } from 'react-native'
import { $root } from 'startupjs'

export default async function finishAuth () {
  const successRedirectUrl = $root.get('_session.auth.successRedirectUrl')

  if (Platform.OS === 'web') {
    window.location.pathname = successRedirectUrl
  } else {
    await AsyncStorage.setItem('successRedirectUrl', successRedirectUrl)
    NativeModules.DevSettings.reload()
  }
}
