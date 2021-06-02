import { useEffect } from 'react'
import escapeRegExp from 'lodash/escapeRegExp'
import { getLangMeta, getMetaKey } from './../../helpers'
import usePage from './../../../usePage'
import useLangs from './../../../useLangs'
import { decodePath } from './../../../../isomorphic'
// import { useConfig } from './../../../config'
import useTranslations from './useTranslations'
import useI18nTranslations from './useI18nTranslations'

export default function usePageInit () {
  // create translation documents in db
  // if two people open the page at the same time for the first time
  // this hook can crash the page due to the document creation race condition
  useI18nTranslations()

  const [{ filter, search }, $page] = usePage()
  const [translationsMeta, $translationsMeta] = usePage('translationsMeta')
  const translations = useTranslations()
  // const { lang: defaultLang } = useConfig()
  const langs = useLangs({ default: false })

  console.log('1')

  // calculating metadata that is displayed on the page
  if (!translationsMeta) {
    console.log('2')
    const meta = {}

    for (const translationFileKey in translations) {
      for (const fileTranslationKey in translations[translationFileKey]) {
        for (const lang of langs) {
          const langMeta = getLangMeta(
            translationFileKey,
            fileTranslationKey,
            lang
          )
          const langMetaKey = getMetaKey(
            translationFileKey,
            fileTranslationKey,
            lang
          )

          meta[langMetaKey] = langMeta
        }

        meta[getMetaKey(translationFileKey, fileTranslationKey)] = {
          key: fileTranslationKey
        }
      }

      meta[getMetaKey(translationFileKey)] = {
        filename: translationFileKey
      }
    }

    throw $translationsMeta.set(meta)
  }

  useEffect(() => {
    console.log('3')
    const filtersCounters = {}

    for (const translationMetaKey in translationsMeta) {
      const translationMeta = translationsMeta[translationMetaKey]
      if (translationMeta.type !== 'lang') continue
      filtersCounters[translationMeta.status] = (filtersCounters[translationMeta.status] || 0) + 1
      filtersCounters.pending = translationMeta.states.pending ? (filtersCounters.pending || 0) + 1 : filtersCounters.pending
    }

    $page.set('filtersCounters', filtersCounters)
  }, [JSON.stringify(translationsMeta)])

  useEffect(() => {
    console.log('4')
    // index is needed for coloring to zebra
    let index = 0
    const displayTranslationKeys = []
    let _translations = translations

    if (search) {
      _translations = _translations.filter(({ key }) => {
        return new RegExp(escapeRegExp(search), 'i').test(decodePath(key))
      })
    }

    for (const translationFileKey in _translations) {
      displayTranslationKeys.push({
        key: getMetaKey(translationFileKey),
        type: 'filename',
        index
      })

      const fileTranslationKeys = _translations[translationFileKey]

      for (const fileTranslationKey in fileTranslationKeys) {
        displayTranslationKeys.push({
          key: getMetaKey(translationFileKey, fileTranslationKey),
          type: 'key',
          index
        })

        for (const lang of langs) {
          displayTranslationKeys.push({
            key: getMetaKey(translationFileKey, fileTranslationKey, lang),
            type: 'lang',
            index
          })
        }
      }
      index++
    }

    $page.set('displayTranslationKeys', displayTranslationKeys)
  }, [filter, search])
}
