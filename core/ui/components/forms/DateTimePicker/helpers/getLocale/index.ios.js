import { Settings } from 'react-native'

export default function getLocale () {
  return Settings.get('AppleLocale') || Settings.get('AppleLanguages')[0]
}
