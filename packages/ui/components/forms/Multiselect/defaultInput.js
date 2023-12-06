import React, { useEffect, useImperativeHandle } from 'react'
import { pug, observer } from 'startupjs'
import Div from './../../Div'
import Span from './../../typography/Span'
import themed from '../../../theming/themed'
import './index.styl'

function DefaultInput ({
  style,
  value = [],
  placeholder,
  disabled,
  focused,
  readonly,
  children,
  onOpen,
  onHide,
  _hasError
}, ref) {
  useImperativeHandle(ref, () => ({
    focus: onOpen,
    blur: onHide
  }), [])

  useEffect(() => {
    if (focused && disabled) onHide()
  }, [disabled])

  return pug`
    if readonly
      Span= value.join(', ')
    else
      Div.input(
        style=style
        styleName={ disabled, focused, readonly, error: _hasError }
        onPress=disabled || readonly ? void 0 : onOpen
        wrap
        row
      )
        if !value.length
          Span.placeholder= placeholder || '-'

        = children
  `
}

export default observer(
  themed('Multiselect', DefaultInput),
  { forwardRef: true }
)
