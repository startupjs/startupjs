import { Linking } from 'react-native'

export default async function onLogin (providerName, redirectUrl) {
  const query = redirectUrl ? `?redirectUrl=${redirectUrl}` : ''
  Linking.openURL(`/auth/${providerName}` + query)
}
