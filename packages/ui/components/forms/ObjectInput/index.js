import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { SCHEMA_TYPE_TO_INPUT } from '../helpers'
import Input from '../Input'
import Div from '../../Div'
import Card from '../../Card'
import Span from '../../typography/Span'
import themed from '../../../theming/themed'
import { useLayout } from './../../../hooks'
import './index.styl'

function ObjectInput ({
  style,
  inputStyle,
  $value,
  label,
  description,
  layout,
  errors,
  properties,
  order
}) {
  if (!$value || !properties) {
    return null
  }

  layout = useLayout({ layout, label, description })

  const pure = layout === 'pure'
  const value = $value.get()

  order = getOrder(order, properties)

  function getInputs () {
    return order.map((key, index) => {
      const { input, type, dependsOn, dependsValue, ...inputProps } = properties[key] || {}

      if (resolvesDeps(value, dependsOn, dependsValue)) {
        return {
          ...inputProps,
          key,
          type: input || SCHEMA_TYPE_TO_INPUT[type] || type,
          $value: $value.at(key)
        }
      }
      // TODO: When the dependsOn field changes and this field is no longer visible -- clear it.
    }).filter(Boolean)
  }

  const inputs = getInputs()

  if (inputs.length === 0) return null

  function renderContainer (children) {
    if (pure) {
      return pug`
        Div(style=[style, inputStyle])= children
      `
    } else {
      return pug`
        Div(style=style)
          if label
            Span.label= label
          Card(
            style=inputStyle
            variant='outlined'
          )
            = children
          if description
            Span.description(description)= description
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
        error=errors[key]
      )
  `)
}

ObjectInput.defaultProps = {
  errors: {}
}

ObjectInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  $value: PropTypes.any.isRequired,
  errors: PropTypes.object,
  label: PropTypes.string,
  description: PropTypes.string,
  layout: PropTypes.oneOf(['pure', 'rows']),
  order: PropTypes.array,
  properties: PropTypes.object.isRequired
}

export default observer(themed(ObjectInput))

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
