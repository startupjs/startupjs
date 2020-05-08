import React from 'react'
import { observer, useLocal } from 'startupjs'
import { useParams } from 'startupjs/app'
import { useDocsContext } from '../../../../docsContext'
import { Span, Br } from '@startupjs/ui'
import { DEFAULT_LANGUAGE } from '../../../const'
import { ScrollView } from 'react-native'
import './index.styl'
// import { Sandbox } from '../../../components'

export default observer(function PDoc ({
  style
}) {
  function getComponent (item, lang) {
    if (!item) return
    if (!item.component) throw Error('No component specified')
    if (typeof item.component.type === 'function') return item.component
    if (item.component[lang]) return item.component[lang]
    return item.component[DEFAULT_LANGUAGE]
  }

  const { lang } = useParams()
  const docs = useDocsContext()
  const [docPath] = useLocal('$render.params.path')
  const segments = docPath.split('/')
  const Component = segments.reduce((component, segment) => {
    const Component = component[segment]
    switch (Component.type) {
      case 'mdx':
        return getComponent(Component, lang)
      case 'sandbox':
        return
        // return React.createElement(Span)
        // return React.createElement(Sandbox)
      case 'collapse':
        return Component.items
    }
  }, docs)
  // const Component = getComponent(doc, lang)

  if (!Component) return pug`Span 404. Not found`

  return pug`
    ScrollView.root
      Br
      Component
      Br(lines=4)
  `
})
