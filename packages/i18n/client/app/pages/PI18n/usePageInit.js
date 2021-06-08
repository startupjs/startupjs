import { useEffect } from 'react'
import { useComponentId } from 'startupjs'
import escapeRegExp from 'lodash/escapeRegExp'
import {
  getLangMeta,
  getMetaKey,
  useForceUpdate,
  useForceUpdatePageInit,
  useForceUpdateFiltersCounters
} from './../../helpers'
import usePage from './../../../usePage'
import useLangs from './../../../useLangs'
import { decodePath } from './../../../../isomorphic'
import { useConfig } from './../../../config'
import useTranslations from './useTranslations'
import useI18nTranslations from './useI18nTranslations'

export default function usePageInit () {
  const componentId = useComponentId()
  // create translation documents in db
  // if two people open the page at the same time for the first time
  // this hook can crash the page due to the document creation race condition
  useI18nTranslations()
  const [{ filter, search }, $page] = usePage()
  const [langsMeta, $langsMeta] = usePage('langsMeta')
  const translations = useTranslations()
  const { lang: defaultLang } = useConfig()
  const langs = useLangs({ default: false })
  const [forceUpdatePageInit, setForceUpdatePageInit] = useForceUpdatePageInit()
  const [forceUpdateFiltersCounters] = useForceUpdateFiltersCounters()
  const [forceUpdate, setForceUpdate] = useForceUpdate(componentId)

  // calculating metadata that is displayed on the page
  if (!langsMeta || forceUpdatePageInit) {
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
      }
    }

    const promises = [$langsMeta.set(meta)]

    // force update is the hack for useEffect's because
    // throwing the promise when component is mounted
    // does not recalculate mounted hooks
    if (forceUpdatePageInit) {
      setForceUpdate()
      setForceUpdatePageInit(false)
    }

    throw Promise.all(promises)
  }

  useEffect(() => {
    const filtersCounters = {}
    // get the langsMeta manually because the hook that returns the langsMeta
    // does not keep up to pull up the data
    const langsMeta = $langsMeta.get()

    for (const langMetaKey in langsMeta) {
      const { state, statuses } = langsMeta[langMetaKey]

      for (const statusKey in statuses) {
        const status = statuses[statusKey]
        if (!status) continue
        const counter = filtersCounters[statusKey] || 0
        const increment = status ? 1 : 0
        filtersCounters[statusKey] = counter + increment
      }

      filtersCounters[state] = (filtersCounters[state] || 0) + 1
    }
    $page.set('filtersCounters', filtersCounters)
  }, [forceUpdateFiltersCounters, forceUpdate])

  useEffect(() => {
    // index is needed for coloring to zebra
    let index = 0
    const displayTranslations = []
    const translationFiles = {}
    let langsMetaKeys = Object.keys(langsMeta)

    if (search) {
      langsMetaKeys = langsMetaKeys.filter(langMetaKey => {
        const { translationFileKey } = langsMeta[langMetaKey]
        const decodedKey = decodePath(translationFileKey)
        return new RegExp(escapeRegExp(search), 'i').test(decodedKey)
      })
    }

    if (filter) {
      langsMetaKeys = langsMetaKeys.filter(langMetaKey => {
        const langMeta = langsMeta[langMetaKey]
        // we have two states and one status of translation
        // so we have combined them into one state 'filter'
        // split it to 'state' and 'status' states and
        // split ui view in the sidebar when we will have
        // a lot of states and statuses
        return langMeta.state === filter || langMeta.statuses[filter]
      })
    }

    for (const langMetaKey of langsMetaKeys) {
      const langMeta = langsMeta[langMetaKey]
      const { translationFileKey, fileTranslationKey, lang } = langMeta

      if (!translationFiles[translationFileKey]) {
        translationFiles[translationFileKey] = {}
      }

      if (!translationFiles[translationFileKey][fileTranslationKey]) {
        translationFiles[translationFileKey][fileTranslationKey] = []
      }

      translationFiles[translationFileKey][fileTranslationKey].push(lang)
    }

    for (const translationFileKey in translationFiles) {
      const fileTranslations = translationFiles[translationFileKey]

      displayTranslations.push({
        key: getMetaKey(translationFileKey),
        type: 'filename',
        value: translationFileKey,
        index
      })

      for (const fileTranslationKey in fileTranslations) {
        const langs = fileTranslations[fileTranslationKey]

        displayTranslations.push({
          key: getMetaKey(translationFileKey, fileTranslationKey),
          type: 'key',
          value: fileTranslationKey,
          index
        })

        // default lang
        displayTranslations.push({
          key: getMetaKey(translationFileKey, fileTranslationKey, defaultLang),
          type: 'defaultLang',
          lang: defaultLang,
          value: translations[translationFileKey][fileTranslationKey],
          index
        })

        for (const lang of langs) {
          displayTranslations.push({
            key: getMetaKey(translationFileKey, fileTranslationKey, lang),
            type: 'lang',
            index
          })
        }
      }

      index++
    }

    $page.set('displayTranslations', displayTranslations)
  }, [filter, search, forceUpdate])
}
