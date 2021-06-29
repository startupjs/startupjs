import React from 'react'
import Div from './../../Div'
import Row from './../../Row'
import Span from './../../typography/Span'
import { useLayout } from './../../../hooks'
import './index.styl'

export default function DefaultInput ({
  value = [],
  label,
  description,
  layout,
  placeholder,
  disabled,
  focused,
  readonly,
  children,
  onOpen
}) {
  layout = useLayout({ layout, label, description })

  const pure = layout === 'pure'

  function renderContainer (children) {
    if (pure) {
      return pug`
        Div= children
      `
    } else {
      return pug`
        Div
          Div.info
            if label
              Span.label(
                styleName={focused}
                bold
              )= label
            if description
              Span.description(description)= description
          = children
      `
    }
  }

  return renderContainer(pug`
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
  `)
}
