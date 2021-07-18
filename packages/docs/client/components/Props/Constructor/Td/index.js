import React from 'react'
import { observer } from 'startupjs'
import { Div } from '@startupjs/ui'
import './index.styl'

export default observer(function Td ({ children, style }) {
  return pug`
    Div.root(style=style)= children
  `
})
