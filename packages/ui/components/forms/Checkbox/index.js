import React, { useState } from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import Row from './../../Row'
import Span from './../../Span'
import Checkbox from './checkbox'
import Switch from './switch'
import { useLayout } from './../../../hooks'
import './index.styl'

const INPUT_COMPONENTS = {
  checkbox: Checkbox,
  switch: Switch
}

function CheckboxInput ({
  style,
  variant,
  label,
  value,
  layout,
  disabled,
  onBlur,
  onFocus,
  onChange
}) {
  const _layout = useLayout(layout, label)
  const pure = _layout === 'pure'
  const [focused, setFocused] = useState(false)

  function _onBlur () {
    console.log('_onBlur')
    setFocused(false)
  }

  function _onFocus () {
    if (disabled) return
    setFocused(true)
  }

  function _onChange () {
    if (disabled) return
    onChange && onChange(!value)
  }

  const extraStyles = {}
  if (disabled) extraStyles.opacity = 0.5

  function renderInput (standalone) {
    const Input = INPUT_COMPONENTS[variant]
    return pug`
      Input(
        style=standalone ? [style, extraStyles] : {}
        checked=value
        focused=focused
        disabled=disabled
        onBlur=(...args) => {
          console.log(args, 'args')
          _onBlur()
          onBlur && onBlur(...args)
        }
        onFocus=(...args) => {
          _onFocus()
          onFocus && onFocus(...args)
        }
        onChange=_onChange
      )
    `
  }

  if (pure) return renderInput(true)

  return pug`
    TouchableOpacity(activeOpacity=1 onPress=_onChange)
      Row.root(style=[style, extraStyles] vAlign='center')
        = renderInput()
        if label
          Span.label= label
  `
}

CheckboxInput.defaultProps = {
  variant: 'checkbox',
  value: false,
  disabled: false
}

CheckboxInput.propTypes = {
  variant: propTypes.oneOf(['checkbox', 'switch']),
  label: propTypes.string,
  value: propTypes.bool,
  layout: propTypes.oneOf(['pure', 'rows']),
  disabled: propTypes.bool,
  onBlur: propTypes.func,
  onFocus: propTypes.func,
  onChange: propTypes.func
}

export default observer(CheckboxInput)
//
//
// TouchableOpacity(4px onChange)  TouchableOpacity(4px 0 onChange)
// View(4px)                       View()
