import React from 'react'
import { observer, useBind } from 'startupjs'
import PropTypes from 'prop-types'
import { SCHEMA_TYPE_TO_INPUT } from '../helpers'
import inputs from './inputs'

function Input ({
  input,
  type,
  ...props
}, ref) {
  input = input || type
  input = SCHEMA_TYPE_TO_INPUT[input] || input

  const { Component, getProps } = inputs[input]
  const componentProps = getProps(props)
  const bindingProps = useBind(componentProps)

  return pug`
    Component(
      ref=ref
      ...props
      ...componentProps
      ...bindingProps
    )
  `
}

const possibleInputs = Object.keys(inputs)
const possibleTypes = Object.keys(SCHEMA_TYPE_TO_INPUT)

Input.defaultProps = {
  type: 'text'
}

Input.propTypes = {
  type: PropTypes.oneOf(possibleInputs.concat(possibleTypes)),
  value: PropTypes.any,
  $value: PropTypes.any,

  options: PropTypes.any, // Select, MultiSelect, Radio
  onChange: PropTypes.func, // Select, MultiSelect, Radio
  onChangeText: PropTypes.func // TextInput
}

export default observer(Input, { forwardRef: true })
