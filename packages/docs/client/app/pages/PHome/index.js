import { useEffect } from 'react'
import { observer, emit, useLocal } from 'startupjs'
import { useDocsContext } from '../../../../docsContext'
import { useLang } from '../../../clientHelpers'
import { DEFAULT_LANGUAGE } from '../../../const'

export default observer(function PHome ({
  style
}) {
  const docs = useDocsContext()
  const [params = {}] = useLocal('$render.params')
  const paramsLang = params.lang
  let [lang = DEFAULT_LANGUAGE, setLang] = useLang()
  if (paramsLang && paramsLang !== lang) {
    lang = paramsLang
    setLang(lang)
  }

  function getDocPath (docs) {
    let path = '/'
    const docName = Object.keys(docs)[0]
    const doc = docs[docName]
    switch (doc.type) {
      case 'mdx':
        path += docName
        break
      case 'collapse':
        path += docName
        if (!doc.component) path += getDocPath(doc.items)
        break
    }
    return path
  }

  useEffect(() => {
    emit(
      'url',
      `/docs/${lang}` + getDocPath(docs),
      { replace: true }
    )
  }, [])
  return null
})
