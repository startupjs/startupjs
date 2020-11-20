import React, { useState } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { useLayout } from '../../../hooks'
import Input from './input'
import Span from '../../typography/Span'
import './index.styl'

function NumberInput ({
  style,
  wrapperStyle,
  inputStyle,
  buttons,
  disabled,
  label,
  layout,
  max,
  min,
  placeholder,
  readonly,
  size,
  step,
  value,
  onBlur,
  onChange,
  onChangeNumber,
  onFocus
}) {
  const _layout = useLayout(layout, label)
  const pure = _layout === 'pure'
  const [focused, setFocused] = useState(false)

  function _onBlur (...args) {
    setFocused(false)
    typeof onBlur === 'function' && onBlur(...args)
  }

  function _onFocus (...args) {
    if (disabled) return
    setFocused(true)
    typeof onFocus === 'function' && onFocus(...args)
  }

  function renderInput (standalone) {
    if (readonly) {
      return pug`
        Span.readonlySpan(
          styleName=[size]
        )= value
      `
    }

    return pug`
      Input(
        style=standalone ? [style, wrapperStyle] : wrapperStyle
        inputStyle=inputStyle
        buttons=buttons
        disabled=disabled
        focused=focused
        max=max
        min=min
        placeholder=placeholder
        size=size
        step=step
        value=value
        onBlur=_onBlur
        onChange=onChange
        onChangeNumber=onChangeNumber
        onFocus=_onFocus
      )
    `
  }

  if (pure) return renderInput(true)

  return pug`
    View.root(style=style)
      Span.label(
        styleName={focused}
        variant='description'
      )= label || (value && placeholder) || ' '
      = renderInput()
  `
}

NumberInput.defaultProps = {
  buttons: 'vertical',
  disabled: false,
  max: Number.MAX_SAFE_INTEGER,
  min: Number.MIN_SAFE_INTEGER,
  readonly: false,
  size: 'm',
  step: 1
}

NumberInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  wrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttons: PropTypes.oneOf(['none', 'horizontal', 'vertical']),
  disabled: PropTypes.bool,
  label: PropTypes.string,
  layout: PropTypes.oneOf(['pure', 'rows']),
  max: PropTypes.number,
  min: PropTypes.number,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  size: PropTypes.oneOf(['l', 'm', 's']),
  step: PropTypes.number,
  value: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onChangeNumber: PropTypes.func,
  onFocus: PropTypes.func
}

export default observer(NumberInput)
