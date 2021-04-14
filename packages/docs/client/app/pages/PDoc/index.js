import React from 'react'
import { observer, useLocal } from 'startupjs'
import { Span, Br, Div } from '@startupjs/ui'
import { useDocsContext } from '../../../../docsContext'
import { useLang } from '../../../clientHelpers'
import './index.styl'

export default observer(function PDoc ({
  style
}) {
  const docs = useDocsContext()
  const [docPath] = useLocal('$render.params.path')
  const segments = docPath.split('/')
  const [lang] = useLang()
  const Component = segments.reduce((docs, segment) => {
    const doc = docs[segment]
    if (!doc) return
    const Component = getComponent(doc, lang)
    if (Component) return Component
    if (doc.type === 'collapse') return doc.items
  }, docs)

  return pug`
    Div.content
      Br
      if Component
        Component
        Br(lines=4)
      else
        Span(variant='h2') Page not found
  `
})

function getComponent (item, lang) {
  if (!item) return
  if (!item.component) return
  if (item.component[lang]) return item.component[lang]
  return item.component
}
