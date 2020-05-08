import React from 'react'
import { observer, useLocal } from 'startupjs'
import { useParams } from 'startupjs/app'
import { useDocsContext } from '../../../../docsContext'
import { Span, Br } from '@startupjs/ui'
import { DEFAULT_LANGUAGE } from '../../../const'
import { ScrollView } from 'react-native'
import './index.styl'
import { Sandbox } from '../../../components'

export default observer(function PDoc ({
  style
}) {
  function getComponent (item, lang) {
    if (!item) return
    if (!item.component) return
    if (typeof item.component.type === 'function') return item.component
    if (item.component[lang]) return item.component[lang]
    return item.component[DEFAULT_LANGUAGE]
  }

  const { lang } = useParams()
  const docs = useDocsContext()
  const [docPath] = useLocal('$render.params.path')
  const segments = docPath.split('/')
  const Component = segments.reduce((docs, segment) => {
    const doc = docs[segment]
    const type = doc.type
    const Component = getComponent(doc, lang)
    if (Component) {
      if (type === 'sandbox') return () => React.createElement(Sandbox, { Component })
      return Component
    } else {
      if (doc.type === 'collapse') return doc.items
      throw Error('No component specified')
    }
  }, docs)

  if (!Component) return pug`Span 404. Not found`

  return pug`
    ScrollView.root
      Br
      Component
      Br(lines=4)
  `
})
