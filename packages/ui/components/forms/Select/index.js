import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import pick from 'lodash/pick'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { getLabelFromValue } from './helpers'
import AdvancedSelect from './AdvancedSelect'
import TextInput from '../TextInput'
import Wrapper from './Wrapper'

function Select ({
  options,
  value,
  disabled,
  showEmptyValue,
  search,
  advanced,
  multiSelect,
  onChange,
  ...props
}, ref) {
  if (search || advanced || multiSelect) {
    return pug`
      AdvancedSelect(
        options=options
        value=value
        disabled=disabled
        showEmptyValue=showEmptyValue
        search=search
        multiSelect=multiSelect
        onChange=onChange
        ...props
      )
    `
  }

  function renderWrapper ({ style }, children) {
    return pug`
      Wrapper(
        style=style
        options=options
        disabled=disabled
        value=value
        search=search
        showEmptyValue=showEmptyValue
        onChange=onChange
      )= children
    `
  }

  return pug`
    TextInput(
      ref=ref
      value=getLabelFromValue(value, options)
      disabled=disabled
      icon=faAngleDown
      iconPosition='right'
      _renderWrapper=renderWrapper
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
      'placeholder',
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
