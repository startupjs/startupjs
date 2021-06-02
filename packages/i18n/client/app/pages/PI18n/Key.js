/* eslint-disable no-unreachable */
import React from 'react'
import { observer, styl } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import usePage from './../../../usePage'
import { decodePath } from './../../../../isomorphic'

export default observer(function Key ({ style, _key }) {
  const [meta] = usePage(`translationsMeta.${_key}`)

  return pug`
    Div.root(style=style)
      Span(bold)= decodePath(meta.key)
  `

  styl`
    .root
      padding-top 3u
      padding-bottom 1u
  `
})
