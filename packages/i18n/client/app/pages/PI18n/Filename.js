/* eslint-disable no-unreachable */
import React from 'react'
import { observer, styl } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import usePage from './../../../usePage'
import { decodePath } from './../../../../isomorphic'

export default observer(function Filename ({ style, _key }) {
  const [meta] = usePage(`translationsMeta.${_key}`)

  return pug`
    Div.root(style=style)
      Div.file(align='between' vAlign='center')
        Span.filename= decodePath(meta.filename)
  `

  styl`
    .root
      padding-top 1.5u
    .file
      padding-bottom 0.5u
      border-bottom-width 1px
      border-bottom color $UI.colors.dark
    .filename
      font(l)
  `
})
