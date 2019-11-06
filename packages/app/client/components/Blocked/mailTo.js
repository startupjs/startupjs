import { Linking } from 'react-native'

export default function mailTo (email) {
  Linking.openURL('mailto:' + email)
}
