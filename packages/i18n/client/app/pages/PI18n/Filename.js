/* eslint-disable no-unreachable */
import React from 'react'
import { pug, observer, styl } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import { decodePath } from './../../../../isomorphic'

export default observer(function Filename ({ style, meta }) {
  return pug`
    Div.root(style=style)
      Div.file(align='between' vAlign='center')
        Span.filename= decodePath(meta.value)
  `

  styl`
    .root
      padding-top 1.5u
    .file
      padding-bottom 0.5u
      border-bottom-width 1px
      border-bottom color var(--color-border-secondary)
    .filename
      font(h6)
  `
})
