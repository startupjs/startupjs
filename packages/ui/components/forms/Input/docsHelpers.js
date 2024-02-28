import { $ } from 'startupjs'
import Input from './'

export function getPropsForType () {
  const $input = $.session.Sandbox.Input
  const type = $input.get('type') || Input.defaultProps.type

  const onChangeValue = value => $input.set('value', value)
  const commonProps = {
    type,
    value: $input.value.get(),
    $value: $input.value
  }

  switch (type) {
    case 'text':
    case 'string':
    case 'password':
      return { ...commonProps, onChangeText: onChangeValue }

    case 'checkbox':
    case 'boolean':
      return { ...commonProps, onChange: onChangeValue }

    case 'select':
    case 'radio':
    case 'multiselect':
      return { ...commonProps, options: ['New York', 'Los Angeles', 'Tokyo'] }

    case 'date':
    case 'time':
    case 'datetime':
      return { ...commonProps, onChangeDate: onChangeValue }

    case 'number':
    case 'integer':
      return { ...commonProps, onChangeNumber: onChangeValue }

    case 'array':
      return { ...commonProps, items: { type: 'text' } }

    case 'object':
      return {
        ...commonProps,
        properties: {
          email: { input: 'text', label: 'Email' },
          password: {
            input: 'text',
            label: 'Password',
            description: "Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter"
          }
        }
      }

    case 'color':
      return commonProps

    case 'range':
      return { ...commonProps, onChange: onChangeValue }
  }
}

export function getDefaultValueForType () {
  const $input = $.session.Sandbox.Input
  const type = $input.get('type') || Input.defaultProps.type

  if (type === 'array') return ['Green', 'Blue']
  return undefined
}
