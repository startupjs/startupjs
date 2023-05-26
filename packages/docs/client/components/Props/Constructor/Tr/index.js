import React from 'react'
import { observer } from 'startupjs'
import { themed, Div } from '@startupjs/ui'
import './index.styl'

export default observer(themed(function Tr ({ children, style, theme }) {
  return pug`
    Div.root(style=style styleName=[theme])= children
  `
}))
