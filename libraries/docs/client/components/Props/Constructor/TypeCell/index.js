import React, { useCallback, useMemo } from 'react'
import { pug, observer, $ } from 'startupjs'
import { Button, Span, themed } from '@startupjs/ui'
import '../index.styl'

const MAX_ITEMS = 10

export default observer(themed(function TypeCell ({ possibleValues, theme, type }) {
  const $collapsed = $(true)

  const values = useMemo(() => {
    if (!Array.isArray(possibleValues)) return []
    return $collapsed.get() ? possibleValues.slice(0, MAX_ITEMS) : possibleValues
  }, [$collapsed, possibleValues])

  const toggleList = useCallback(() => {
    $collapsed.set(!$collapsed.get())
  }, [$collapsed])

  const renderButton = useCallback(() => {
    if (possibleValues?.length <= MAX_ITEMS) return null
    return pug`
      Span &nbsp&nbsp
      Button(
        color='primary'
        size='s'
        variant='text'
        onPress=toggleList
      )= $collapsed.get() ? 'More...' : 'Less'
    `
  }, [$collapsed, possibleValues, toggleList]) // eslint-disable-line react-hooks/exhaustive-deps

  return pug`
    if type === 'oneOfType'
      Span.possibleType
        each value, index in values
          React.Fragment(key=index)
            if index
              Span.separator #{' | '}
            Span.type(styleName=[theme])= value && value.name
        = renderButton()
    else if Array.isArray(possibleValues)
      Span.possibleValue
        each value, index in values
          Span(key=index)
            if index
              Span.separator(styleName=[theme]) #{' | '}
            Span.value(styleName=[theme])= JSON.stringify(value)
        = renderButton()
    else
      Span.type(styleName=[theme])= type
  `
}))
