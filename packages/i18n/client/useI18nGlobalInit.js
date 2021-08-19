import { useMemo } from 'react'
import { useDoc, useModel, useSession } from 'startupjs'
import languageDetector from './languageDetector'
import { useConfig } from './config'

export default function useI18nGlobalInit () {
  const $session = useModel('_session')
  const [lang, $lang] = useSession('lang')
  const config = useConfig()
  const { lang: defaultLang, langs } = config

  function getLang (lang) {
    if (!lang) return defaultLang
    return langs.includes(lang) ? lang : defaultLang
  }

  if (!lang) {
    const _languageDetector = config.languageDetector === 'function'
      ? config.languageDetector
      : languageDetector

    const promise = _languageDetector()

    if (promise && promise.then) {
      throw promise.then(lang => $lang.set(getLang(lang)))
    } else {
      throw $lang.set(getLang(promise))
    }
  }

  const [, $i18nTranslations] = useDoc('i18nTranslations', lang)

  useMemo(() => {
    $session.ref('i18nTranslations', $i18nTranslations)
  }, [])

  return true
}
