import { Linking } from 'react-native'
import { WEB_LOGIN_URL } from '../../isomorphic/constants'

export default async function login (_, redirectUrl) {
  const query = redirectUrl ? `?redirectUrl=${redirectUrl}` : ''
  Linking.openURL(WEB_LOGIN_URL + query)
}
