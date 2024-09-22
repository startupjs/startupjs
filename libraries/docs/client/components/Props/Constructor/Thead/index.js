import React from 'react'
import { pug, observer } from 'startupjs'
import { Div } from '@startupjs/ui'

export default observer(function Thead ({ children, style }) {
  return pug`
    Div(style=style)= children
  `
})
