import { Linking } from 'react-native'
import { LINKEDIN_WEB_LOGIN_URL } from '../../isomorphic'

export default async function onLogin () {
  Linking.openURL(LINKEDIN_WEB_LOGIN_URL)
}
