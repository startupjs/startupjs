import React from 'react'
import { pug, observer } from 'startupjs'
import { H6, Span } from '@startupjs/ui'

export default observer(() => {
  return pug`
    H6 Extended Page
    Span This is an extended page added by the new plugin.
  `
})
