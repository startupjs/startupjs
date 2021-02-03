import { Linking } from 'react-native'
import { LOGIN_URL } from '../../isomorphic'

export default async function onLogin (redirectUrl) {
  const query = redirectUrl ? `?redirectUrl=${redirectUrl}` : ''
  Linking.openURL(LOGIN_URL + query)
}
