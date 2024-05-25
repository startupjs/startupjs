import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../../Div'
import Input from './input'
import { getOptionLabel, getOptionDescription, stringifyValue } from './helpers'
import './index.styl'

function Radio ({
  style,
  inputStyle,
  value,
  options,
  row,
  _hasError,
  ...props
}) {
  return pug`
    Div.root(style=style styleName={ row })
      each option, index in options
        - const optionValue = stringifyValue(option)
        - const checked = optionValue === stringifyValue(value)
        - const error = _hasError && (value ? checked : true)

        Input.input(
          key=optionValue
          style=inputStyle
          styleName={ row, first: !index }
          checked=checked
          value=optionValue
          description=getOptionDescription(option)
          error=error
          ...props
        )= getOptionLabel(option)
  `
}

Radio.defaultProps = {
  options: [],
  row: false,
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
        value: PropTypes.any,
        label: PropTypes.oneOfType([PropTypes.string]),
        description: PropTypes.oneOfType([PropTypes.string])
      })
    ])
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  row: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onChange: PropTypes.func,
  _hasError: PropTypes.bool // @private
}

export default observer(Radio)
