import { Platform } from 'react-native'
import { BASE_URL } from '@env'
import Constants from 'expo-constants'

const isWeb = Platform.OS === 'web'

const url = isWeb
  ? BASE_URL
  : Constants.manifest.packagerOpts.dev
    ? 'http://' + Constants.manifest.debuggerHost.split(':').shift() + ':' + (BASE_URL.split(':').pop() || '3000')
    : BASE_URL

export default url
