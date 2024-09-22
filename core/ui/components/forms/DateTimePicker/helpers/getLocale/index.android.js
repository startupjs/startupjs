import { I18nManager } from 'react-native'

export default function getLocale () {
  return I18nManager.getConstants().localeIdentifier
}
