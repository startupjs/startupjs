import { useEffect } from 'react'
import { observer, emit } from 'startupjs'
import { useDocsContext } from '../../../../docsContext'

export default observer(function PHome () {
  const docs = useDocsContext()

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
      '/docs' + getDocPath(docs),
      { replace: true }
    )
  }, [])

  return null
})
