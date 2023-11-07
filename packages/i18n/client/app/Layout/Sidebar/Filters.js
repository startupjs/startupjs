/* eslint-disable no-unreachable */
import React, { useCallback } from 'react'
import { pug, observer, styl } from 'startupjs'
import { Div, Row, Span, Icon } from '@startupjs/ui'
import { FILTERS, FILTERS_META } from './../../constants'
import usePage from './../../../usePage'

export default observer(function Filters () {
  const [filtersCounters] = usePage('filtersCounters')
  const [filter, $filter] = usePage('filter')
  const onStatePress = useCallback((value) => {
    $filter.get() === value
      ? $filter.del()
      : $filter.set(value)
  })

  // waiting for page initialization to set initial values
  if (!filtersCounters) return null

  return pug`
    Div
      each FILTER, index in FILTERS
        - const meta = FILTERS_META[FILTER]
        - const active = filter === FILTER
        Row.filter(
          key=FILTER
          styleName={ first: !index }
          align='between'
          vAlign='center'
          onPress=() => { onStatePress(FILTER) }
        )
          Row(vAlign='center')
            Icon(style=meta.style icon=meta.icon)
            Span.label(bold=active)= meta.label
          Span(description bold=active)= filtersCounters[FILTER] || 0
  `

  styl`
    .filter
      margin-top 1u
      &.first
        margin-top 0
    .label
      margin-left 1u
  `
})
