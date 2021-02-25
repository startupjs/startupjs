import { Platform } from 'react-native'
import RNRestart from 'react-native-restart'
import { $root } from 'startupjs'
import { BASE_URL } from '@env'
import axios from 'axios'

export default async function finishAuth (redirectUrl) {
  const successRedirectUrl = redirectUrl ||
    $root.get('$render.query.redirectUrl') ||
    $root.get('_session.auth.successRedirectUrl') ||
    '/'

  if (Platform.OS !== 'web') {
    await axios.post(BASE_URL + '/api/restore-url', {
      restoreUrl: successRedirectUrl
    })
    RNRestart.Restart()
  }
}
