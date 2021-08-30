import { NativeModules } from 'react-native'

export default function getLocale () {
  return (
    NativeModules.SettingsManager.settings.AppleLocale ||
    NativeModules.SettingsManager.settings.AppleLanguages[0]
  )
}
