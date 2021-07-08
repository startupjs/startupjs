import React, { useState, useCallback } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Input from './input'
import Span from './../../typography/Span'
import themed from '../../../theming/themed'
import wrapInput from './../wrapInput'
import './index.styl'

function TextInput ({
  style,
  wrapperStyle,
  inputStyle,
  iconStyle,
  className,
  placeholder,
  value,
  size,
  editable,
  disabled,
  readonly,
  onBlur,
  onFocus,
  renderWrapper, // @private - used by Select
  ...props
}, ref) {
  const [focused, setFocused] = useState(false)

  const _onBlur = useCallback((...args) => {
    setFocused(false)
    onBlur && onBlur(...args)
  }, [])

  const _onFocus = useCallback((...args) => {
    if (disabled) return
    setFocused(true)
    onFocus && onFocus(...args)
  }, [])

  function renderInput (standalone) {
    if (readonly) {
      return pug`
        Span= value
      `
    }

    return pug`
      Input(
        ref=ref
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
        onFocus=_onFocus
        onBlur=_onBlur
        ...props
      )
    `
  }

  return pug`
    View.root(style=style)
      = renderInput()
  `
}

const ObservedTextInput = wrapInput(observer(themed('TextInput', TextInput), { forwardRef: true }))

ObservedTextInput.defaultProps = {
  size: 'm',
  value: '', // default value is important to prevent error
  disabled: false,
  readonly: false,
  resize: false,
  editable: Input.defaultProps.editable,
  numberOfLines: Input.defaultProps.numberOfLines,
  iconPosition: 'left'
}

ObservedTextInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  wrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's']),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  resize: PropTypes.bool,
  editable: Input.propTypes.editable,
  numberOfLines: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChangeText: PropTypes.func,
  onIconPress: PropTypes.func
}

export default ObservedTextInput
