/* eslint-disable no-unreachable */
import React, { useCallback } from 'react'
import { observer, styl } from 'startupjs'
import { Div, Icon, Row, Span } from '@startupjs/ui'
import {
  NO_TYPE,
  DISPLAYED_TRANSLATION_TYPES,
  TRANSLATION_TYPES_META
} from './../../constants'
import usePage from './../../../usePage'

export default observer(function Types () {
  const [type, $type] = usePage('type')

  const [countersByType] = usePage('countersByType')
  const onTypePress = useCallback((value) => {
    $type.get() === value
      ? $type.set(NO_TYPE)
      : $type.set(value)
  })

  // wait while the page initializes initial values
  if (!countersByType || !type) return null

  return pug`
    Div
      each TYPE, index in DISPLAYED_TRANSLATION_TYPES
        - const active = type === TYPE
        - const meta = TRANSLATION_TYPES_META[TYPE]
        Row.type(
          key=TYPE
          align='between'
          vAlign='center'
          onPress=() => { onTypePress(TYPE) }
        )
          Row(vAlign='center')
            Icon(style=meta.iconStyle icon=meta.icon)
            Span.label(bold=active)= meta.label
          Span(variant='description' bold=active)= countersByType[TYPE]
  `

  styl`
    .type
      margin-top 1u
    .label
      margin-left 1.5u
  `
})
