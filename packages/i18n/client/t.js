import { $root } from 'startupjs'

export default function t (key, defaultValue) {
  return $root.get(`_session.translations.${key}`) || defaultValue
}
