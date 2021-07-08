// Input full width for column layout?
// docs
// checkbox?
// textinput label - placeholder
// проверить isFocused
import React, { useState, useCallback } from 'react'
import { styl, observer, useComponentId } from 'startupjs'
import PropTypes from 'prop-types'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import Div from './../Div'
import Icon from './../Icon'
import Row from './../Row'
import { Span } from './../typography'
import { useLayout } from './../../hooks'
import themed from '../../theming/themed'

export default function wrapInput (Component) {
  function InputWrapper ({
    style,
    label,
    description,
    layout,
    error,
    onFocus,
    onBlur,
    ...props
  }, ref) {
    const cId = useComponentId()
    layout = useLayout({ layout, label, description })

    console.log(cId, 'input wrapper')

    const [focused, setFocused] = useState(false)

    const _onFocus = useCallback((...args) => {
      setFocused(true)
      onFocus && onFocus(...args)
    }, [])

    const _onBlur = useCallback((...args) => {
      setFocused(false)
      onBlur && onBlur(...args)
    }, [])

    const _label = pug`
      if label
        Span.label(
          styleName=[layout, { focused, error }]
        )= label
    `
    const _description = pug`
      if description
        Span.description(styleName=[layout] description)= description
    `
    const input = pug`
      Component(
        ref=ref
        onFocus=_onFocus
        onBlur=_onBlur
        _hasError=!!error
        ...props
      )
      if error
        Row.errorContainer(vAlign='center')
          Icon.errorContainer-icon(icon=faExclamationCircle)
          Span.errorContainer-text= error
    `

    return pug`
      Div.root(style=style part='root' styleName=[layout])
        if layout === 'rows'
          = _label
          = input
          = _description
        else if layout === 'columns'
          Div.left
            = _label
            = _description
          Div.right
            = input
        else if layout === 'pure'
          = input

    `
  }

  InputWrapper.propTypes = {
    label: PropTypes.string,
    description: PropTypes.string,
    layout: PropTypes.oneOf(['pure', 'rows', 'columns']),
    error: PropTypes.string
  }

  return observer(themed('InputWrapper', InputWrapper), { forwardRef: true })
}

styl`
  $errorColor = $UI.colors.attention
  $focusedColor = $UI.colors.primary

  // common
  .label
    font(body2)

    &.focused
      color $focusedColor

    &.error
      color $errorColor

  .description
    font(caption)

  .errorContainer
    margin-top 1u
    margin-bottom 0.5u

    &-icon
      color $errorColor

    &-text
      font(caption)
      margin-left 0.5u
      color $errorColor

  // rows
  .rows
    .label&
      margin-bottom 0.5u

    .description&
      margin-top 0.5u

  // columns
  .left
  .right
    flex 1

  .columns
    .root&
      flex-direction row
      align-items center

`
