import React from 'react'
import { pug, observer } from 'startupjs'
import { Row, Span, TextInput } from '@startupjs/ui'
import './languages.styl'

export default observer(function DefaultLang ({ style, meta }) {
  return pug`
    Row.root(style=style vAlign='center')
      Row.info
        Span.lang= meta.lang
      TextInput.input(
        size='s'
        resize
        value=meta.value
        disabled
      )
  `
})
