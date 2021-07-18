import { $root } from 'startupjs'

export default function languageDetector () {
  return $root.get('$render.query.lang') ||
    $root.get('_session.lang') ||
    $root.get('_session.user.lang')
}
