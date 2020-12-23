import { Linking } from 'react-native'
import { AZUREAD_WEB_LOGIN_URL } from '../../isomorphic'

export default async function onLogin (redirectUrl) {
  const query = redirectUrl ? `?redirectUrl=${redirectUrl}` : ''
  Linking.openURL(AZUREAD_WEB_LOGIN_URL + query)
}
