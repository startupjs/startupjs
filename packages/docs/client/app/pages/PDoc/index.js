import React from 'react'
import { observer, useLocal } from 'startupjs'
import { useDocsContext } from '../../../../docsContext'
import { Span, Br } from '@startupjs/ui'
import { DEFAULT_LANGUAGE } from '../../../const'
import { ScrollView } from 'react-native'
import './index.styl'

export default observer(function PDoc ({
  style
}) {
  function getComponent (item, lang) {
    if (!item) return
    if (!item.component) return
    if (typeof item.component === 'function') return item.component
    if (item.component[lang]) return item.component[lang]
    return item.component[DEFAULT_LANGUAGE]
  }

  const [params] = useLocal('$render.params')
  const lang = params.lang
  const docs = useDocsContext()
  const [docPath] = useLocal('$render.params.path')
  const segments = docPath.split('/')
  const Component = segments.reduce((docs, segment) => {
    const doc = docs[segment]
    const Component = getComponent(doc, lang)
    if (Component) return Component
    if (doc.type === 'collapse') return doc.items
    throw Error('No component specified')
  }, docs)

  if (!Component) return pug`Span 404. Not found`

  return pug`
    ScrollView.root
      Br
      Component
      Br(lines=4)
  `
})
