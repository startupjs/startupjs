import { useMemo } from 'react'
import { $root, useQuery } from 'startupjs'
import useSupportedLangs from './../../../useSupportedLangs'

export default function useI18nTranslations () {
  const supportedLangs = useSupportedLangs({ exceptDefault: true })
  const translationIds = useMemo(() => {
    const ids = []
    for (const supportedLang of supportedLangs) {
      ids.push(
        supportedLang,
        $root.scope(`i18nTranslations.${supportedLang}`).getDraftId()
      )
    }
    return ids
  }, [])

  const [i18nTranslations] = useQuery('i18nTranslations', {
    _id: { $in: translationIds }
  })

  const promises = []

  // create missing translations docs
  for (const supportedLang of supportedLangs) {
    const $lang = $root.scope(`i18nTranslations.${supportedLang}`)
    if (!$lang.get()) promises.push($lang.createNew())
  }

  if (promises.length) throw Promise.all(promises)

  return i18nTranslations
}
