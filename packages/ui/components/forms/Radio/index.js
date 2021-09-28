import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../../Div'
import Input from './input'
import { getOptionLabel, stringifyValue } from './helpers'
import './index.styl'

function Radio ({
  style,
  inputStyle,
  value,
  options,
  _hasError,
  ...props
}) {
  return pug`
    Div(style=style)
      each option in options
        - const optionValue = stringifyValue(option)
        - const checked = optionValue === stringifyValue(value)
        - const error = _hasError && (value ? checked : true)

        Input(
          key=optionValue
          style=inputStyle
          checked=checked
          value=optionValue
          error=error
          ...props
        )= getOptionLabel(option)
  `
}

Radio.defaultProps = {
  options: [],
  disabled: false,
  readonly: false
}

Radio.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    ])
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onChange: PropTypes.func,
  _hasError: PropTypes.bool // @private
}

export default observer(Radio, { forwardRef: true })
