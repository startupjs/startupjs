import { NativeModules, AsyncStorage, Platform } from 'react-native'
import { $root } from 'startupjs'

export default async function finishAuth (redirectUrl) {
  const successRedirectUrl = redirectUrl || $root.get('$render.query.redirectUrl') ||
    $root.get('_session.auth.successRedirectUrl') || '/'

  if (Platform.OS === 'web') {
    window.location.href = successRedirectUrl
  } else {
    // There are no returning promis on Android devices
    // so usage of await getting app stuck
    AsyncStorage.setItem('successRedirectUrl', successRedirectUrl)
    setTimeout(() => {
      NativeModules.DevSettings.reload()
    }, 0)
  }
}
