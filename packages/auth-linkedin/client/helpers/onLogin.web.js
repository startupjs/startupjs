import { Linking } from 'react-native'
import { LINKEDIN_WEB_LOGIN_URL } from '../../isomorphic'

export default async function onLogin (redirectUrl) {
  const query = redirectUrl ? `?redirectUrl=${redirectUrl}` : ''
  Linking.openURL(LINKEDIN_WEB_LOGIN_URL + query)
}
