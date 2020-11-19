import React, { useMemo, useLayoutEffect } from 'react'
import { Text, Platform } from 'react-native'
import { observer } from 'startupjs'
import { Span, themed, Input } from '@startupjs/ui'
import parsePropTypes from 'parse-prop-types'
import Table from './Table'
import Tbody from './Tbody'
import Thead from './Thead'
import Tr from './Tr'
import Td from './Td'
import './index.styl'

export default observer(themed(function Constructor ({ Component, $props, style, theme }) {
  const entries = useMemo(() => {
    return parseEntries(Object.entries(parsePropTypes(Component)))
  }, [Component])

  useLayoutEffect(() => {
    for (const prop of entries) {
      if (prop.defaultValue) {
        // NOTE: Due to a racer patch, last argument cannot be a function
        // because it will be used as a callback of `$props.set`,
        // so we use null to avoid this behavior when defaultValue is function
        $props.set(prop.name, prop.defaultValue, null)
      }
    }
  }, entries)

  return pug`
    Table.table(style=style)
      Thead.thead
        Tr
          Td: Text.header(styleName=[theme]) PROP
          Td: Text.header(styleName=[theme]) TYPE
          Td: Text.header(styleName=[theme]) DEFAULT
          Td: Text.header.right(styleName=[theme]) VALUE
      Tbody
        each entry, index in entries
          - const { name, type, defaultValue, possibleValues, possibleTypes } = entry
          - const $value = $props.at(name)
          - let value = $value.get()

          Tr(key=index)
            Td: Span.name(
              style={
                fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace'
              }
            )= name
            Td
              if type === 'oneOf'
                Span.possibleValue
                  - let first = true
                  each possibleValue, index in possibleValues
                    React.Fragment(key=index)
                      if !first
                        Span.separator #{' | '}
                      Span.value(styleName=[theme])= JSON.stringify(possibleValue)
                      - first = false
              else if type === 'oneOfType'
                Span.possibleType
                  - let first = true
                  each possibleValue, index in possibleTypes
                    React.Fragment(key=index)
                      if !first
                        Span.separator #{' | '}
                      Span.type(styleName=[theme])= possibleValue && possibleValue.name
                      - first = false
              else
                Span.type(styleName=[theme])= type
            Td: Span.value(styleName=[theme])= JSON.stringify(defaultValue)
            Td.vCenter
              if type === 'string'
                Input(
                  type='text'
                  size='s'
                  value=value || ''
                  onChangeText=value => $value.set(value)
                )
              else if type === 'number'
                - const aValue = parseFloat(value)
                Input(
                  type='text'
                  size='s'
                  value='' + (isNaN(aValue) ? '' : aValue)
                  onChangeText=value => {
                    value = parseFloat(value)
                    if (isNaN(value)) value = undefined
                    $value.set(value)
                  }
                )
              else if type === 'node'
                Input(
                  type='text'
                  size='s'
                  value=value || ''
                  onChangeText=value => $value.set(value)
                )
              else if type === 'oneOf'
                Input(
                  type='select'
                  size='s'
                  value=value
                  onChange=value => $value.set(value)
                  options=possibleValues
                )
              else if type === 'bool'
                Input.checkbox(
                  type='checkbox'
                  value=value
                  onChange=value => $value.set(value)
                )
              else
                Span.unsupported -
  `
}))

function parseEntries (entries) {
  return entries.map(entry => {
    let meta = entry[1]
    return {
      name: entry[0],
      type: meta.type.name,
      defaultValue: meta.defaultValue && meta.defaultValue.value,
      possibleValues: meta.type.value,
      possibleTypes: meta.type.value
    }
  })
}
