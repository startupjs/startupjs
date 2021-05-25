/* eslint-disable no-unreachable */
import React, { useCallback } from 'react'
import { observer, styl } from 'startupjs'
import { Div, Row, Span } from '@startupjs/ui'
import { DISPLAYED_TRANSLATION_FILTERS } from './../../constants'
import usePage from './../../../usePage'

export default observer(function Filters () {
  const [countersByFilter] = usePage('countersByFilter')
  const [filter, $filter] = usePage('filter')
  const onFilterPress = useCallback((value) => {
    $filter.get() === value
      ? $filter.del()
      : $filter.set(value)
  })

  // wait while the page initializes initial values
  if (!countersByFilter) return null

  return pug`
    Div
      each FILTER, index in DISPLAYED_TRANSLATION_FILTERS
        - const value = FILTER.value
        - const active = filter === value
        Row.filter(
          key=FILTER
          styleName={ first: !index }
          align='between'
          vAlign='center'
          onPress=() => { onFilterPress(value) }
        )
          Span.label(bold=active)= FILTER.label
          Span(description bold=active)= countersByFilter[value]
  `

  styl`
    .filter
      margin-top 1u
      &.first
        margin-top 0
  `
})
