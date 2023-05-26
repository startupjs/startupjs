import { $root } from 'startupjs'

export default function t (key, defaultValue) {
  return $root.get(`_session.i18nTranslations.${key}`) || defaultValue
}
