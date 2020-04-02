import React from 'react'
import { observer } from 'startupjs'
import docs from '@startupjs/ui/docs'
import { Div, Span } from '@startupjs/ui'
import { useDocName } from 'clientHelpers'
import './index.styl'

export default observer(function PDoc ({
  style
}) {
  const [docName] = useDocName()
  const Component = docs[docName]
  if (!Component) return pug`Span 404. Not found`

  return pug`
    Div.root
      Component
  `
})
