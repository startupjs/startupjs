import React from 'react'
import { Div, Span } from '@startupjs/ui'
import './index.styl'

export default function OrDivider () {
  return pug`
    Div.root
      Div.line.left
      Div.line.right
      Span.text or
  `
}
