import React from 'react'
import { observer } from 'startupjs'
import Input from '../Input'
import Div from '../../Div'
import Card from '../../Card'
import Span from '../../typography/Span'
import './index.styl'

const TYPE_TO_INPUT = {
  string: 'text',
  boolean: 'checkbox'
}

export default observer(function ObjectInput ({
  style,
  inputStyle,
  $value,
  value,
  label,
  properties,
  order
}) {
  if (!$value) {
    console.error('[ui -> Object] $value is required')
    return null
  }
  if (!properties) {
    console.error('[ui -> Object] properties is required')
    return null
  }

  order = getOrder(order, properties)

  function getInputs () {
    return order.map((key, index) => {
      const { input, type, dependsOn, dependsValue, ...inputProps } = properties[key] || {}
      if (resolvesDeps(value, dependsOn, dependsValue)) {
        return {
          ...inputProps,
          key,
          type: input || TYPE_TO_INPUT[type] || type,
          $value: $value.at(key)
        }
      }
      // TODO: When the dependsOn field changes and this field is no longer visible -- clear it.
    }).filter(Boolean)
  }

  const inputs = getInputs()

  if (inputs.length === 0) return null

  function renderContainer (children) {
    if (label) {
      return pug`
        Div(style=style)
          Span(size='s')= label
          Card(
            style=inputStyle
            variant='outlined'
          )
            = children
      `
    } else {
      return pug`
        Div(style=[style, inputStyle])= children
      `
    }
  }

  return renderContainer(pug`
    each input, index in inputs
      - const { key, style, ...inputProps } = input
      Input.input(
        ...inputProps
        key=key
        style=style
        styleName={ pushTop: index !== 0 }
      )
  `)
})

function getOrder (order, properties) {
  return order != null ? order : Object.keys(properties)
}

function resolvesDeps (value = {}, dependsOn, dependsValue) {
  return (
    // always show if dependsOn field doesn't exist
    !dependsOn ||
    // dependsValue is value
    (dependsValue != null && value[dependsOn] === dependsValue) ||
    // dependsValue is array
    (dependsValue != null && Array.isArray(dependsValue) &&
      dependsValue.indexOf(value[dependsOn]) !== -1
    ) ||
    // dependsValue is not present, check that value[dependsOn] has something
    (
      (dependsValue == null || (typeof dependsValue === 'string' && dependsValue.trim() === '')) &&
      value[dependsOn] != null &&
      !(typeof value[dependsOn] === 'string' && value[dependsOn].trim() === '')
    )
  )
}
