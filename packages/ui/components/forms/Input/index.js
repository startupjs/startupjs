import React, { useMemo } from 'react'
import { observer, $root } from 'startupjs'
import PropTypes from 'prop-types'
import ArrayInput from '../ArrayInput'
import Checkbox from '../Checkbox'
import DateTimePicker from '../DateTimePicker'
import ErrorWrapper from '../ErrorWrapper'
import NumberInput from '../NumberInput'
import ObjectInput from '../ObjectInput'
import PasswordInput from '../PasswordInput'
import Select from '../Select'
import TextInput from '../TextInput'
import themed from '../../../theming/themed'

function Input ({
  style,
  error,
  type,
  $value,
  ...props
}) {
  const { inputs, types } = useMemo(() => {
    const _inputs = {
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
      array: {
        Component: ArrayInput,
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
      time: {
        Component: DateTimePicker,
        getProps: $value => ({
          date: $value && $value.get(),
          onDateChange: value => $value && $value.setDiff(value),
          mode: 'time'
        })
      },
      password: {
        Component: PasswordInput,
        getProps: $value => ({
          value: $value && $value.get(),
          onChangeText: value => $value && $value.setDiff(value)
        })
      }
    }
    return { inputs: _inputs, types: Object.keys(_inputs) }
  }, [])

  if (!type || !types.includes(type)) {
    if (type) {
      console.error(`[ui -> Input] Wrong type provided: ${type}. Available types: ${types}`)
    } else {
      console.error(`[ui -> Input] type property must be specified. Available types: ${types}`)
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
  const { Component, getProps } = inputs[type]
  const bindingProps = $value ? getProps($value) : {}
  return pug`
    ErrorWrapper(err=error)
      Component(
        ...bindingProps
        ...props
        style=style
        $value=$value
      )
  `
}

Input.defaultProps = {
  type: 'text'
}

Input.propTypes = {
  error: PropTypes.string,
  type: PropTypes.oneOf([
    'text',
    'checkbox',
    'object',
    'select',
    'number',
    'date',
    'datetime',
    'time',
    'array',
    'password'
  ]).isRequired,
  $value: PropTypes.any
}

export default observer(themed(Input))
