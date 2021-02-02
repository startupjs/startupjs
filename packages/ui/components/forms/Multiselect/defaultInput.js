
import React from 'react'
import Row from './../../Row'
import Span from './../../typography/Span'
import './index.styl'

export default function DefaultInput ({
  value,
  placeholder,
  disabled,
  focused,
  error,
  readonly,
  children,
  onOpen
}) {
  return pug`
    Row.input(
      styleName={ disabled, focused, error, readonly }
      onPress=disabled || readonly ? void 0 : onOpen
      wrap
    )
      if !value || !value.length && !readonly
        Span.placeholder= placeholder
      if !value || !value.length && readonly
        Span.placeholder='-'
      = children
  `
}
