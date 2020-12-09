import { Linking } from 'react-native'
import { WEB_LOGIN_URL } from '../../isomorphic/constants'

export default async function login () {
  Linking.openURL(WEB_LOGIN_URL)
}
