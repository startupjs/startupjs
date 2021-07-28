import React, { useMemo } from 'react'
import { observer, $root } from 'startupjs'
import PropTypes from 'prop-types'
import ArrayInput from '../ArrayInput'
import Checkbox from '../Checkbox'
import DateTimePicker from '../DateTimePicker'
import Multiselect from '../Multiselect'
import NumberInput from '../NumberInput'
import ObjectInput from '../ObjectInput'
import PasswordInput from '../PasswordInput'
import Radio from '../Radio'
import Select from '../Select'
import TextInput from '../TextInput'
import { SCHEMA_TYPE_TO_INPUT } from '../helpers'
import wrapInput from './wrapInput'

function Input ({
  input,
  type,
  $value,
  ...props
}) {
  const inputs = useMemo(() => ({
    array: {
      Component: ArrayInput,
      getProps: $value => ({
        value: $value && $value.get()
      })
    },
    checkbox: {
      Component: Checkbox,
      getProps: $value => ({
        value: $value && $value.get(),
        onChange: value => $value && $value.setDiff(value)
      })
    },
    date: {
      Component: DateTimePicker,
      getProps: $value => ({
        date: $value && $value.get(),
        onDateChange: value => $value && $value.setDiff(value),
        mode: 'date'
      })
    },
    datetime: {
      Component: DateTimePicker,
      getProps: $value => ({
        date: $value && $value.get(),
        onDateChange: value => $value && $value.setDiff(value),
        mode: 'datetime'
      })
    },
    multiselect: {
      Component: Multiselect,
      getProps: $value => ({
        value: $value && $value.get(),
        onChangeNumber: value => $value && $value.setDiff(value)
      })
    },
    number: {
      Component: NumberInput,
      getProps: $value => ({
        value: $value && $value.get(),
        onChangeNumber: value => $value && $value.setDiff(value)
      })
    },
    object: {
      Component: ObjectInput,
      getProps: $value => ({
        value: $value && $value.get()
      })
    },
    password: {
      Component: PasswordInput,
      getProps: $value => ({
        value: $value && $value.get(),
        onChangeText: value => $value && $value.setDiff(value)
      })
    },
    radio: {
      Component: Radio,
      getProps: $value => ({
        value: $value && $value.get(),
        onChange: value => $value && $value.setDiff(value)
      })
    },
    select: {
      Component: Select,
      getProps: $value => ({
        value: $value && $value.get(),
        onChange: value => $value && $value.setDiff(value)
      })
    },
    time: {
      Component: DateTimePicker,
      getProps: $value => ({
        date: $value && $value.get(),
        onDateChange: value => $value && $value.setDiff(value),
        mode: 'time'
      })
    },
    text: {
      Component: wrapInput(
        TextInput,
        {
          layoutOptions: {
            rows: {
              descriptionPosition: 'bottom'
            }
          },
          _isLabelColoredWhenFocusing: true,
          _isLabelClickable: true
        }
      ),
      getProps: $value => ({
        value: $value && $value.get(),
        // TODO: Use stringInsert and stringRemove
        onChangeText: value => $value && $value.setDiff(value)
      })
    }
  }), [])

  if ($value && typeof $value === 'string') {
    if (/.+\..+/.test($value)) {
      $value = $root.at($value)
    } else {
      console.error(`[ui -> Input] You can not specify the top-level absolute path in $value: ${$value}`)
      $value = undefined
    }
  }

  input = input || type
  input = SCHEMA_TYPE_TO_INPUT[input] || input

  const { Component, getProps } = inputs[input]
  const bindingProps = $value ? getProps($value) : {}

  return pug`
    Component(
      ...bindingProps
      ...props
      $value=$value
    )
  `
}

const possibleInputs = [
  'array',
  'checkbox',
  'date',
  'datetime',
  'multiselect',
  'number',
  'object',
  'password',
  'radio',
  'select',
  'time',
  'text'
]
const possibleTypes = Object.keys(SCHEMA_TYPE_TO_INPUT)

Input.defaultProps = {
  type: 'text'
}

Input.propTypes = {
  input: PropTypes.oneOf(possibleInputs),
  type: PropTypes.oneOf(possibleInputs.concat(possibleTypes)),
  value: PropTypes.any,
  $value: PropTypes.any
}

export default observer(Input)
