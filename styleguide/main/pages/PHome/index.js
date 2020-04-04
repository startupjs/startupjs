import { useEffect } from 'react'
import { observer, emit } from 'startupjs'
import docs from '@startupjs/ui/docs'
import { useLang } from 'clientHelpers'

export default observer(function PHome ({
  style
}) {
  let [lang] = useLang()
  if (!docs[lang]) lang = 'en'
  useEffect(() => {
    emit('url', `/${lang}/docs/` + Object.keys(docs[lang])[0])
  }, [])
  return null
})
