import { Linking } from 'react-native'
import { WEB_LOGIN_URL } from '../../isomorphic'

export default async function onLogin (baseUrl, redirectUrl) {
  const query = redirectUrl ? `?redirectUrl=${redirectUrl}` : ''
  Linking.openURL(WEB_LOGIN_URL + query)
}
