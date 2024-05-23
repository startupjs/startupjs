import { useMemo } from 'react'
import { $root, useQuery } from 'startupjs'
import useLangs from './../../../useLangs'

export default function useI18nTranslations () {
  const langs = useLangs({ default: false })
  const translationIds = useMemo(() => {
    const ids = []
    for (const lang of langs) {
      ids.push(
        lang,
        $root.scope(`i18nTranslations.${lang}`).getDraftId()
      )
    }
    return ids
  }, [])

  const [i18nTranslations] = useQuery('i18nTranslations', {
    _id: { $in: translationIds }
  })

  const promises = []

  // create missing translations docs
  for (const lang of langs) {
    const $lang = $root.scope(`i18nTranslations.${lang}`)
    if (!$lang.get()) promises.push($lang.createNew())
  }

  if (promises.length) throw Promise.all(promises)

  return i18nTranslations
}
