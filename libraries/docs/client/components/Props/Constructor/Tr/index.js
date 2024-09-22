import React from 'react'
import { pug, observer } from 'startupjs'
import { themed, Div } from '@startupjs/ui'
import './index.styl'

export default observer(themed(function Tr ({ children, style }) {
  return pug`
    Div.root(style=style)= children
  `
}))
