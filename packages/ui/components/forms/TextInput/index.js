import React, { useState } from 'react'
import { observer } from 'startupjs'
import { View } from 'react-native'
import Input from './input'
import Span from './../../typography/Span'
import propTypes from 'prop-types'
import { useLayout } from './../../../hooks'
import './index.styl'

function TextInput ({
  style,
  wrapperStyle,
  inputStyle,
  className,
  label,
  placeholder,
  value,
  layout,
  disabled,
  onBlur,
  onFocus,
  renderWrapper, // @private - used by Select
  readonly,
  size,
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
        className=standalone ? className : undefined
        value=value
        placeholder=placeholder
        disabled=disabled
        focused=focused
        renderWrapper=renderWrapper
        size=size
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
        size='s'
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
  numberOfLines: 1,
  iconPosition: 'left',
  iconColor: 'dark'
}

TextInput.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  inputStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  wrapperStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  label: propTypes.string,
  placeholder: propTypes.string,
  value: propTypes.string,
  iconColor: propTypes.string,
  size: propTypes.oneOf(['l', 'm', 's']),
  layout: propTypes.oneOf(['pure', 'rows']),
  disabled: propTypes.bool,
  readonly: propTypes.bool,
  resize: propTypes.bool,
  numberOfLines: propTypes.number,
  icon: propTypes.oneOfType([propTypes.object, propTypes.func]),
  iconPosition: propTypes.oneOf(['left', 'right']),
  onBlur: propTypes.func,
  onFocus: propTypes.func,
  onChangeText: propTypes.func,
  onIconPress: propTypes.func
}

export default observer(TextInput)
