import { useMemo } from 'react'
import { $root, useDoc, useModel, useSession } from 'startupjs'
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
    const _languageDetector = typeof config.languageDetector === 'function'
      ? config.languageDetector
      : languageDetector

    const promise = _languageDetector()

    if (promise && promise.then) {
      throw promise.then(lang => $lang.set(getLang(lang)))
    } else {
      throw $lang.set(getLang(promise))
    }
  }

  useDoc('i18nTranslations', lang)

  useMemo(() => {
    // we dont remove previous ref
    // because racer removes it itself when creating a new one
    $session.ref('i18nTranslations', $root.at(`i18nTranslations.${lang}`))
  }, [lang])

  return true
}
