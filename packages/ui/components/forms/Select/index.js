import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import pick from 'lodash/pick'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { getLabelFromValue } from './Wrapper/helpers'
import TextInput from '../TextInput'
import Wrapper from './Wrapper'

function Select ({
  options,
  value,
  disabled,
  showEmptyValue,
  emptyValueLabel,
  onChange,
  ...props
}, ref) {
  function renderWrapper ({ style }, children) {
    return pug`
      Wrapper(
        style=style
        options=options
        disabled=disabled
        value=value
        onChange=onChange
        showEmptyValue=showEmptyValue
        emptyValueLabel=emptyValueLabel
      )= children
    `
  }

  return pug`
    TextInput(
      ref=ref
      value=getLabelFromValue(value, options, emptyValueLabel)
      disabled=disabled
      icon=faAngleDown
      iconPosition='right'
      _renderWrapper=renderWrapper
      selection={start: 0, end: 0} /* Prevent select text on input when hit the 'Tab' key on web */
      editable=false /* HACK: Fixes cursor visibility when focusing on Select because we're focusing on TextInput */
      ...props
    )
  `
}

Select.defaultProps = {
  options: [],
  ...pick(
    TextInput.defaultProps,
    [
      'size',
      'disabled',
      'readonly'
    ]
  ),
  showEmptyValue: true
}

Select.propTypes = {
  ...pick(
    TextInput.propTypes,
    [
      'style',
      'inputStyle',
      'size',
      'disabled',
      'readonly',
      'onFocus',
      'onBlur',
      '_hasError'
    ]
  ),
  value: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.any,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    ])
  ),
  showEmptyValue: PropTypes.bool,
  onChange: PropTypes.func
}

export default observer(
  Select,
  { forwardRef: true }
)
