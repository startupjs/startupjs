import { useMemo } from 'react'
import { $root, useDoc, useModel, useSession } from 'startupjs'
import languageDetector from './languageDetector'
import { useConfig } from './config'

export default function useI18nGlobalInit () {
  const $session = useModel('_session')
  const [lang, $lang] = useSession('lang')
  const config = useConfig()
  const defaultLang = config.defaultLang

  if (!lang) {
    const configLanguageDetector = config.languageDetector

    // TODO: Check that the lang in supportedLang
    if (typeof configLanguageDetector === 'function') {
      const promise = configLanguageDetector()

      if (promise && promise.then) {
        throw promise.then(lang => $lang.set(lang || defaultLang))
      } else {
        $lang.set(promise || defaultLang)
      }
    } else {
      const lang = languageDetector()
      $lang.set(lang || defaultLang)
    }
  }

  const [translations, $translations] = useDoc('translations', lang)

  if (!translations && lang !== defaultLang) {
    throw $root.add('translations', { id: lang })
  }

  useMemo(() => {
    $session.ref('translations', $translations)
  }, [])

  return true
}
