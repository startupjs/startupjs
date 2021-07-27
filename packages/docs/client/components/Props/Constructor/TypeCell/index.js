import React, { useCallback, useMemo } from 'react'
import { observer, useValue } from 'startupjs'
import { Button, Span, themed } from '@startupjs/ui'
import '../index.styl'

export default observer(themed(function TypeCell ({ possibleValues, theme, type }) {
  const [collapsed, $collapsed] = useValue(true)

  const values = useMemo(() => {
    if (!Array.isArray(possibleValues)) return []
    return collapsed ? possibleValues.slice(0, 10) : possibleValues
  }, [collapsed, possibleValues])

  const toggleList = useCallback(() => {
    $collapsed.setDiff(!collapsed)
  }, [collapsed])

  const renderButton = useCallback(() => {
    if (possibleValues?.length < 11) return null
    return pug`
      Span &nbsp&nbsp
      Button(
        color='primary'
        size='s'
        variant='text'
        onPress=toggleList
      )= collapsed ? 'More...' : 'Less'
    `
  }, [collapsed, possibleValues])

  return pug`
    if type === 'oneOf'
      Span.possibleValue
        each value, index in values
          Span(key=index)
            if index
              Span.separator(styleName=[theme]) #{' | '}
            Span.value(styleName=[theme])= JSON.stringify(value)
        = renderButton()
    else if type === 'oneOfType'
      Span.possibleType
        each value, index in values
          React.Fragment(key=index)
            if index
              Span.separator #{' | '}
            Span.type(styleName=[theme])= value && value.name
        = renderButton()
    else
      Span.type(styleName=[theme])= type
  `
}))
