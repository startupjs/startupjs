import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import TextInput from '../TextInput'
import Wrapper from './Wrapper'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { getLabelFromValue } from './Wrapper/helpers'

// TODO: Refactor and move InputLayout into a separate component

function Select ({
  options,
  style,
  value,
  showEmptyValue,
  disabled,
  onChange,
  readonly,
  ...props
}) {
  function renderWrapper ({ style }, children) {
    return pug`
      Wrapper(
        style=style
        options=options
        disabled=disabled
        value=value
        onChange=onChange
        showEmptyValue=showEmptyValue
      )= children
    `
  }

  return pug`
    TextInput(
      style=style
      readonly=readonly
      value=getLabelFromValue(value, options)
      disabled=disabled,
      icon=faAngleDown
      iconPosition='right'
      renderWrapper=renderWrapper
      ...props
    )
  `
}

Select.defaultProps = {
  disabled: false,
  readonly: false,
  options: [],
  showEmptyValue: true
}

Select.propTypes = {
  disabled: propTypes.bool,
  readonly: propTypes.bool,
  onChange: propTypes.func,
  options: propTypes.array,
  showEmptyValue: propTypes.bool
}

export default observer(Select)
