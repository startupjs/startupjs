import React from 'react'
import { pug, observer } from 'startupjs'
import { Div, Span, TextInput } from '@startupjs/ui'
import './languages.styl'

export default observer(function DefaultLang ({ style, meta }) {
  return pug`
    Div.root(style=style vAlign='center' row)
      Div.info(row)
        Span.lang= meta.lang
      TextInput.input(
        size='s'
        resize
        value=meta.value
        disabled
      )
  `
})
