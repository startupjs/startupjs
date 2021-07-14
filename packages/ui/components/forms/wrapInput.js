// Input full width for column layout?
// docs
// checkbox?
// textinput label - placeholder
// inputstyle, wrapperstyle??
// select focused, blur, clear?
// ref for all inputs?
// move useImperativeHandle for ref to wrapInput?
// skip error for radio input?
// useCallback for focus, blur handlers?
import React, { useState } from 'react'
import { styl, observer } from 'startupjs'
import PropTypes from 'prop-types'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import merge from 'lodash/merge'
import Div from './../Div'
import Icon from './../Icon'
import Row from './../Row'
import { Span } from './../typography'
import { useLayout } from './../../hooks'
import themed from '../../theming/themed'

export default function wrapInput (Component, inputOptions) {
  inputOptions = merge(
    {
      rows: {
        labelPosition: 'top',
        descriptionPosition: 'top'
      }
    },
    inputOptions
  )

  function InputWrapper ({
    style,
    className,
    label,
    description,
    layout,
    layoutOptions,
    error,
    onFocus,
    onBlur,
    ...props
  }, ref) {
    layout = useLayout({ layout, label, description })
    inputOptions = merge(inputOptions, layoutOptions)

    const [focused, setFocused] = useState(false)

    const focusHandler = (...args) => {
      setFocused(true)
      onFocus && onFocus(...args)
    }

    const blurHandler = (...args) => {
      setFocused(false)
      onBlur && onBlur(...args)
    }

    const _label = pug`
      if label
        Span.label(
          styleName=[
            layout,
            layout + '-' + inputOptions.rows.labelPosition,
            { focused, error }
          ]
        )= label
    `
    const _description = pug`
      if description
        Span.description(
          styleName=[
            layout,
            layout + '-' + inputOptions.rows.descriptionPosition
          ]
          description
        )= description
    `
    const input = pug`
      Component(
        ref=ref
        onFocus=focusHandler
        onBlur=blurHandler
        _hasError=!!error
        ...props
      )
    `

    const err = pug`
      if error
        Row.errorContainer(vAlign='center')
          Icon.errorContainer-icon(icon=faExclamationCircle)
          Span.errorContainer-text= error
    `

    return pug`
      Div.root(
        style=style
        part='root'
        styleName=[layout]
        className=className
      )
        if layout === 'rows'
          if inputOptions.rows.labelPosition === 'top'
            = _label
          if inputOptions.rows.descriptionPosition === 'top'
            = _description
            = err
          if inputOptions.rows.labelPosition === 'right'
            Row(vAlign='center')
              = input
              = _label
          else
            = input
          if inputOptions.rows.descriptionPosition === 'bottom'
            = err
            = _description
        else if layout === 'columns'
          Div.left
            = _label
            = _description
          Div.right
            = input
            = err
        else if layout === 'pure'
          = input
          = err

    `
  }

  const componentDisplayName = Component.displayName || Component.name

  InputWrapper.displayName = componentDisplayName + 'InputWrapper'

  InputWrapper.defaultProps = Object.assign(
    {},
    Component.defaultProps,
    inputOptions
  )

  InputWrapper.propTypes = Object.assign({
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    label: PropTypes.string,
    description: PropTypes.string,
    layout: PropTypes.oneOf(['pure', 'rows', 'columns']),
    layoutOptions: PropTypes.shape({
      rows: PropTypes.shape({
        labelPosition: PropTypes.oneOf(['top', 'right']),
        descriptionPosition: PropTypes.oneOf(['top', 'bottom'])
      })
    }),
    error: PropTypes.string
  }, Component.propTypes)

  const ObservedInputWrapper = observer(
    themed('InputWrapper', InputWrapper),
    { forwardRef: true }
  )

  return ObservedInputWrapper
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
    &-top
      .label&
        margin-bottom 0.5u

      .description&
        margin-bottom 0.5u

    &-right
      .label&
        margin-left 1u

    &-bottom
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
