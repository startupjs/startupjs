import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Row from './../../Row'
import Span from './../../typography/Span'
import CheckboxInput from './checkbox'
import SwitchInput from './switch'
import themed from '../../../theming/themed'
import wrapInput from './../wrapInput'
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
  inputStyle,
  variant,
  value,
  readonly,
  onChange,
  // hoverStyle,
  // activeStyle,
  ...props
}) {
  function onPress () {
    onChange && onChange(!value)
  }

  const Input = INPUT_COMPONENTS[variant]

  if (readonly) {
    return pug`
      Row.checkbox-icon-wrap(
        styleName=[variant]
      )
        Span.checkbox-icon(
          styleName={readonly}
        )=value ? READONLY_ICONS.TRUE : READONLY_ICONS.FALSE
    `
  }

  return pug`
    Input(
      style=inputStyle
      value=value
      onPress=onPress
      ...props
    )
    //- hoverStyle=standalone ? hoverStyle : undefined
    //- activeStyle=standalone ? activeStyle : undefined
  `
}

Checkbox.defaultProps = {
  variant: 'checkbox',
  value: false,
  disabled: false,
  readonly: false
}

Checkbox.propTypes = {
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  variant: PropTypes.oneOf(['checkbox', 'switch']),
  value: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onChange: PropTypes.func
}

const ObservedCheckbox = observer(
  themed('Checkbox', Checkbox)
)
const WrappedObservedCheckbox = wrapInput(
  ObservedCheckbox,
  {
    rows: {
      labelPosition: 'right',
      descriptionPosition: 'bottom'
    }
  }
)

export default WrappedObservedCheckbox
