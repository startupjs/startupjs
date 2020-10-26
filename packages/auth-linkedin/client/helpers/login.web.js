import { LINKEDIN_WEB_LOGIN_URL } from '../../isomorphic'
import { Linking } from 'react-native'

export default async function login () {
  Linking.openURL(LINKEDIN_WEB_LOGIN_URL)
}
