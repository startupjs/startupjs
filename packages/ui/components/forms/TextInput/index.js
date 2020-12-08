import React, { useState } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { useLayout } from './../../../hooks'
import Input from './input'
import Span from './../../typography/Span'
import './index.styl'

function TextInput ({
  style,
  wrapperStyle,
  inputStyle,
  iconStyle,
  className,
  label,
  placeholder,
  value,
  size,
  editable,
  layout,
  disabled,
  readonly,
  onBlur,
  onFocus,
  renderWrapper, // @private - used by Select
  ...props
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
        iconStyle=iconStyle
        className=standalone ? className : undefined
        value=value
        placeholder=placeholder
        disabled=disabled
        focused=focused
        renderWrapper=renderWrapper
        size=size
        editable=editable
        onBlur=(...args) => {
          _onBlur()
          onBlur && onBlur(...args)
        }
        onFocus=(...args) => {
          _onFocus()
          onFocus && onFocus(...args)
        }
        ...props
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

TextInput.defaultProps = {
  size: 'm',
  value: '', // default value is important to prevent error
  disabled: false,
  readonly: false,
  resize: false,
  editable: Input.defaultProps.editable,
  numberOfLines: 1,
  iconPosition: 'left'
}

TextInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  wrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's']),
  layout: PropTypes.oneOf(['pure', 'rows']),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  resize: PropTypes.bool,
  editable: PropTypes.bool,
  numberOfLines: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChangeText: PropTypes.func,
  onIconPress: PropTypes.func
}

export default observer(TextInput)
