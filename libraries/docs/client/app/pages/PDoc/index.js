import React from 'react'
import { pug, observer, useLocal } from 'startupjs'
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
    if (!doc) return PageNotFound
    // when page with 'collapse' type has a component to render
    // to display it we have to figure out if it is the last segment or not
    if (doc.type === 'collapse' && segments.length - 1 !== index) {
      return doc.items
    }
    const Component = getComponent(doc, lang)
    return Component || PageNotFound
  }, docs)

  return pug`
    Div.content
      Br
      Component
      Br(lines=4)
  `
})

function PageNotFound () {
  return pug`
    Span.message Page not found
  `
}

function getComponent (item, lang) {
  if (!item) return
  if (!item.component) return
  if (item.component[lang]) return item.component[lang]
  return item.component
}
