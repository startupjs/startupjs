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
  const Component = segments.reduce((docs, segment, index) => {
    const doc = docs[segment]
    if (!doc) return
    const Component = getComponent(doc, lang)
    // when page with 'collapse' type has a component to render
    // to display it we have to figure out if it is the last segment or not
    if (doc.type === 'collapse' && segments.length - 1 !== index) {
      return doc.items
    }
    if (Component) return Component
  }, docs)

  return pug`
    Div.content
      Br
      if Component
        Component
        Br(lines=4)
      else
        Span.message Page not found
  `
})

function getComponent (item, lang) {
  if (!item) return
  if (!item.component) return
  if (item.component[lang]) return item.component[lang]
  return item.component
}
