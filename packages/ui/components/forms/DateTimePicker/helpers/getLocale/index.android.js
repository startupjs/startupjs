import { NativeModules } from 'react-native'

export default function getLocale () {
  return NativeModules.I18nManager.localeIdentifier
}
