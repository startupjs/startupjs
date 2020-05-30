import React, { useState } from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Row from './../../Row'
import Span from './../../typography/Span'
import Checkbox from './checkbox'
import Switch from './switch'
import { useLayout } from './../../../hooks'
import './index.styl'

// const { colors } = config
const isWeb = Platform.OS === 'web'
const INPUT_COMPONENTS = {
  checkbox: Checkbox,
  switch: Switch
}

function CheckboxInput ({
  style,
  className,
  variant,
  label,
  value,
  layout,
  disabled,
  onBlur,
  onFocus,
  onChange,
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

  function _onChange () {
    if (disabled) return
    onChange && onChange(!value)
  }

  const extraStyles = {}
  if (disabled) extraStyles.opacity = 0.5

  const {
    onMouseEnter,
    onMouseLeave,
    onPressIn,
    onPressOut
  } = props
  const [hover, setHover] = useState()
  const [active, setActive] = useState()
  const handlers = {
    onPressIn: (...args) => {
      setActive(true)
      onPressIn && onPressIn(...args)
    },
    onPressOut: (...args) => {
      setActive()
      onPressOut && onPressOut(...args)
    }
  }

  const inputHandlers = { ...handlers }

  if (isWeb) {
    inputHandlers.onMouseEnter = (...args) => {
      setHover(true)
      onMouseEnter && onMouseEnter(...args)
    }
    inputHandlers.onMouseLeave = (...args) => {
      setHover()
      onMouseLeave && onMouseLeave(...args)
    }
  }

  function renderInput (standalone) {
    const Input = INPUT_COMPONENTS[variant]
    return pug`
      Input(
        style=standalone ? [style, extraStyles] : {}
        className=standalone ? className : undefined
        checked=value
        focused=focused
        hover=hover
        active=active
        disabled=disabled
        onBlur=(...args) => {
          _onBlur()
          onBlur && onBlur(...args)
        }
        onFocus=(...args) => {
          _onFocus()
          onFocus && onFocus(...args)
        }
        onChange=_onChange
        ...inputHandlers
      )
    `
  }

  if (pure) return renderInput(true)

  return pug`
    TouchableOpacity(
      activeOpacity=1
      onPress=_onChange
      ...handlers
    )
      Row.root(style=[extraStyles, style] vAlign='center')
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
