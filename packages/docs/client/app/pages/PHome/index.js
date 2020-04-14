import { useEffect } from 'react'
import { useParams } from 'startupjs/app'
import { observer, emit } from 'startupjs'
import { useDocsContext } from '../../../../docsContext'
import { useLang } from '../../../clientHelpers'

export default observer(function PHome ({
  style
}) {
  const docs = useDocsContext()
  let { lang: paramsLang } = useParams()
  let [lang, setLang] = useLang()
  if (paramsLang && paramsLang !== lang) {
    lang = paramsLang
    setLang(lang)
  }
  if (!docs[lang]) lang = 'en'
  useEffect(() => {
    emit('url', `/docs/${lang}/docs/` + Object.keys(docs[lang])[0], true)
  }, [])
  return null
})
