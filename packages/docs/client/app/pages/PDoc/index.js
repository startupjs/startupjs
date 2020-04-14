import React from 'react'
import { observer } from 'startupjs'
import { useParams } from 'startupjs/app'
import { useDocsContext } from '../../../../docsContext'
import { Span, Br } from '@startupjs/ui'
import { useDocName } from '../../../clientHelpers'
import { ScrollView } from 'react-native'
import './index.styl'

export default observer(function PDoc ({
  style
}) {
  const docs = useDocsContext()
  const { lang } = useParams()
  const [docName] = useDocName()
  const Component = docs[lang] && docs[lang][docName]
  if (!Component) return pug`Span 404. Not found`

  return pug`
    ScrollView.root
      Br
      Component
      Br(lines=4)
  `
})
