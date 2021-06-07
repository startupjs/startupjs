/* eslint-disable no-unreachable */
import React from 'react'
import { observer, styl } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import { decodePath } from './../../../../isomorphic'

export default observer(function Key ({ style, meta }) {
  return pug`
    Div.root(style=style)
      Span(bold)= decodePath(meta.value)
  `

  styl`
    .root
      padding-top 3u
      padding-bottom 1u
  `
})
