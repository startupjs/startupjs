import React from 'react'
import { observer } from 'startupjs'
import { Row, Span, TextInput } from '@startupjs/ui'
import usePage from './../../../usePage'
import './languages.styl'

export default observer(function LanguageDefault ({ style, item }) {
  const [value] = usePage(`translations.${item.fullTranslationKey}`)

  return pug`
    Row.root(style=style vAlign='center')
      Row.info
        Span.lang= item.lang
      TextInput.input(
        size='s'
        resize
        value=value
        disabled
      )
  `
})
