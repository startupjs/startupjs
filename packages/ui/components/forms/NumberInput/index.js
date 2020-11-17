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
  className,
  label,
  placeholder,
  value,
  precision,
  step,
  min,
  max,
  size,
  layout,
  buttons,
  disabled,
  readonly,
  onBlur,
  onFocus,
  onChangeNumber,
  onChange,
  renderWrapper // @private - used by Select
}) {
  const _layout = useLayout(layout, label)
  const pure = _layout === 'pure'
  const [focused, setFocused] = useState(false)

  function _onBlur () {
    setFocused(false)
  }

  function _onFocus () {
    if (disabled) return
    setFocused(true)
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
        className=standalone ? className : undefined
        value=value
        precision=precision
        step=step
        min=min
        max=max
        placeholder=placeholder
        buttons=buttons
        disabled=disabled
        focused=focused
        renderWrapper=renderWrapper
        size=size
        onChangeNumber=onChangeNumber
        onChange=onChange
        onBlur=(...args) => {
          _onBlur()
          onBlur && onBlur(...args)
        }
        onFocus=(...args) => {
          _onFocus()
          onFocus && onFocus(...args)
        }
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
  size: 'm',
  max: Number.MAX_SAFE_INTEGER,
  min: Number.MIN_SAFE_INTEGER,
  precision: 0,
  step: 1,
  buttons: 'vertical',
  disabled: false,
  readonly: false
}

NumberInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  wrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.number,
  step: PropTypes.number,
  precision: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(['l', 'm', 's']),
  layout: PropTypes.oneOf(['pure', 'rows']),
  buttons: PropTypes.oneOf(['none', 'horizontal', 'vertical']),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChangeNumber: PropTypes.func,
  onChange: PropTypes.func
}

export default observer(NumberInput)
