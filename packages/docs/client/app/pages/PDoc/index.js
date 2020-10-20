import React from 'react'
import { observer, useLocal } from 'startupjs'
import { useDocsContext } from '../../../../docsContext'
import { Span, Br, Div } from '@startupjs/ui'
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../../const'
import { useLang } from '../../../clientHelpers'
import { ScrollView } from 'react-native'
import './index.styl'
import useRestoreScroll from './useRestoreScroll'

export default observer(function PDoc ({
  style
}) {
  const docs = useDocsContext()
  const [docPath] = useLocal('$render.params.path')
  let segments = docPath.split('/')
  const [currentLanguage = DEFAULT_LANGUAGE] = useLang()
  let lang
  if (LANGUAGES.includes(segments[0])) {
    lang = segments[0]
    segments = segments.slice(1)
  } else {
    lang = currentLanguage
  }
  const Component = segments.reduce((docs, segment) => {
    const doc = docs[segment]
    const Component = getComponent(doc, lang)
    if (Component) return Component
    if (doc.type === 'collapse') return doc.items
    throw Error('No component specified')
  }, docs)

  if (!Component) return pug`Span 404. Not found`

  // NOTE: The main purpose of this hook is to save the scroll position
  // while writing documentation (otherwise it would jump to top on every save)
  const scrollViewProps = useRestoreScroll('PDoc', lang, docPath)

  return pug`
    ScrollView.root(...scrollViewProps)
      Div.content
        Br
        Component
        Br(lines=4)
  `
})

function getComponent (item, lang) {
  if (!item) return
  if (!item.component) return
  if (item.component[lang]) return item.component[lang]
  if (item.component[DEFAULT_LANGUAGE]) return item.component[DEFAULT_LANGUAGE]
  return item.component
}
