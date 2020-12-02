import React from 'react'
import { observer, $root } from 'startupjs'
import PropTypes from 'prop-types'
import TextInput from '../TextInput'
import Checkbox from '../Checkbox'
import ObjectInput from '../ObjectInput'
import Select from '../Select'
import NumberInput from '../NumberInput'

const INPUTS = {
  text: {
    Component: TextInput,
    getProps: $value => ({
      value: $value && $value.get(),
      // TODO: Use stringInsert and stringRemove
      onChangeText: value => $value && $value.setDiff(value)
    })
  },
  checkbox: {
    Component: Checkbox,
    getProps: $value => ({
      value: $value && $value.get(),
      onChange: value => $value && $value.setDiff(value)
    })
  },
  object: {
    Component: ObjectInput,
    getProps: $value => ({
      value: $value && $value.get()
    })
  },
  number: {
    Component: NumberInput,
    getProps: $value => ({
      value: $value && $value.get(),
      onChangeNumber: value => $value && $value.setDiff(value)
    })
  },
  select: {
    Component: Select,
    getProps: $value => ({
      value: $value && $value.get(),
      onChange: value => $value && $value.setDiff(value)
    })
  }
}
const INPUT_TYPES = Object.keys(INPUTS)

function Input ({
  type,
  $value,
  style,
  ...props
}) {
  if (!type || !INPUT_TYPES.includes(type)) {
    if (type) {
      console.error(`[ui -> Input] Wrong type provided: ${type}. Available types: ${INPUT_TYPES}`)
    } else {
      console.error(`[ui -> Input] type property must be specified. Available types: ${INPUT_TYPES}`)
    }
    return null
  }
  if ($value && typeof $value === 'string') {
    if (/.+\..+/.test($value)) {
      $value = $root.at($value)
    } else {
      console.error(`[ui -> Input] You can not specify the top-level absolute path in $value: ${$value}`)
      $value = undefined
    }
  }
  const { Component, getProps } = INPUTS[type]
  const bindingProps = $value ? getProps($value) : {}
  return pug`
    Component(
      ...props
      ...bindingProps
      style=style
      $value=$value
    )
  `
}

Input.defaultProps = {
  type: 'text'
}

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'checkbox', 'object', 'select', 'number']).isRequired,
  $value: PropTypes.any
}

export default observer(Input)
