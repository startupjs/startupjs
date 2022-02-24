import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../../Div'
import Span from './../../typography/Span'
import CheckboxInput from './checkbox'
import SwitchInput from './switch'
import themed from '../../../theming/themed'
import './index.styl'

const INPUT_COMPONENTS = {
  checkbox: CheckboxInput,
  switch: SwitchInput
}

const READONLY_ICONS = {
  TRUE: '✓',
  FALSE: '✗'
}

function Checkbox ({
  style,
  inputStyle,
  variant,
  readonly,
  value,
  onChange,
  onFocus, // skip due to pointless triggering when clicked on the View
  onBlur, // skip due to pointless triggering when clicked on the View
  ...props
}, ref) {
  const Input = INPUT_COMPONENTS[variant]

  function onPress () {
    onChange && onChange(!value)
  }

  return pug`
    Div(style=style)
      if readonly
        Span.readonly=value ? READONLY_ICONS.TRUE : READONLY_ICONS.FALSE
      else
        Input(
          style=inputStyle
          value=value
          onPress=onPress
          ...props
        )
  `
}

Checkbox.defaultProps = {
  variant: 'checkbox',
  value: false,
  disabled: false,
  readonly: false
}

Checkbox.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  variant: PropTypes.oneOf(['checkbox', 'switch']),
  value: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onChange: PropTypes.func,
  _hasError: PropTypes.bool // @private
}

export default observer(
  themed('Checkbox', Checkbox),
  { forwardRef: true }
)
