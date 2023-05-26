import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../Div'
import Row from '../../Row'
import themed from '../../../theming/themed'
import Input from '../Input'
import './index.styl'

function ObjectInput ({
  style,
  inputStyle,
  $value,
  errors,
  properties,
  order,
  row,
  disabled,
  readonly,
  _renderWrapper
}) {
  if (!$value || !properties) {
    return null
  }

  const value = $value.get()

  order = getOrder(order, properties)

  function getInputs () {
    return order.map((key, index) => {
      const { dependsOn, dependsValue, ...inputProps } = properties[key] || {}

      if (resolvesDeps(value, dependsOn, dependsValue)) {
        return {
          ...inputProps,
          key,
          $value: $value.at(key)
        }
      }
      // TODO: When the dependsOn field changes and this field is no longer visible -- clear it.
    }).filter(Boolean)
  }

  const inputs = getInputs()

  if (inputs.length === 0) return null

  if (!_renderWrapper) {
    _renderWrapper = ({ style }, children) => {
      const Container = row ? Row : Div
      return pug`
        Container(style=style)= children
      `
    }
  }

  return _renderWrapper({
    style: [style, inputStyle]
  }, pug`
    each input, index in inputs
      Input.input(
        styleName={ push: index !== 0, row, column: !row }
        error=errors[input.key]
        disabled=disabled
        readonly=readonly
        ...input
      )
  `)
}

ObjectInput.defaultProps = {
  errors: {}
}

ObjectInput.propTypes = {
  row: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  $value: PropTypes.any.isRequired,
  errors: PropTypes.object,
  order: PropTypes.array,
  properties: PropTypes.object.isRequired
}

export default observer(
  themed('ObjectInput', ObjectInput),
  { forwardRef: true }
)

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
