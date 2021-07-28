import React from 'react'
import { observer } from 'startupjs'
import Row from './../../Row'
import Span from './../../typography/Span'
import themed from '../../../theming/themed'
import './index.styl'

function DefaultInput ({
  value = [],
  placeholder,
  disabled,
  focused,
  readonly,
  children,
  onOpen,
  _hasError
}) {
  return pug`
    if readonly
      Span= value.join(', ')
    else
      Row.input(
        styleName={ disabled, focused, readonly }
        onPress=disabled || readonly ? void 0 : onOpen
        wrap
      )
        if !value.length
          Span.placeholder= placeholder || '-'

        = children
  `
}

export default observer(themed('Multiselect', DefaultInput))
