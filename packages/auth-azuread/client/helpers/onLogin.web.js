import { Linking } from 'react-native'
import { AZUREAD_WEB_LOGIN_URL } from '../../isomorphic'

export default async function onLogin () {
  Linking.openURL(AZUREAD_WEB_LOGIN_URL)
}
