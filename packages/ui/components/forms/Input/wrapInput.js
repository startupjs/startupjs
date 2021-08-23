import React, { useRef, useState, useCallback, useImperativeHandle } from 'react'
import { styl, observer } from 'startupjs'
import PropTypes from 'prop-types'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import merge from 'lodash/merge'
import Div from './../../Div'
import Icon from './../../Icon'
import Row from './../../Row'
import { Span } from './../../typography'
import { useLayout } from './../../../hooks'
import themed from '../../../theming/themed'

export default function wrapInput (Component, options) {
  options = merge(
    {
      rows: {
        labelPosition: 'top',
        descriptionPosition: 'top'
      },
      isLabelColoredWhenFocusing: false,
      isLabelClickable: false
    },
    options
  )

  function InputWrapper ({
    label,
    description,
    layout,
    options: componentOptions,
    error,
    ...props
  }, ref) {
    const inputRef = useRef({})

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current.focus && inputRef.current.focus(),
      blur: () => inputRef.current.blur && inputRef.current.blur(),
      clear: () => inputRef.current.clear && inputRef.current.clear(),
      isFocused: () => inputRef.current.isFocused && inputRef.current.isFocused()
    }), [])

    layout = useLayout({
      layout,
      label,
      description
    })

    options = merge(options, componentOptions)
    options = merge(options, options[layout])

    const {
      labelPosition,
      descriptionPosition,
      isLabelColoredWhenFocusing,
      isLabelClickable,
      ...inputProps
    } = options

    const [focused, setFocused] = useState(false)

    const onFocus = useCallback((...args) => {
      setFocused(true)
      props.onFocus && props.onFocus(...args)
    }, [])

    const onBlur = useCallback((...args) => {
      setFocused(false)
      props.onBlur && props.onBlur(...args)
    }, [])

    const _label = pug`
      if label
        Span.label(
          styleName=[
            layout,
            layout + '-' + labelPosition,
            {
              focused: isLabelColoredWhenFocusing ? focused : false,
              error
            }
          ]
          onPress=isLabelClickable
            ? () => inputRef.current && inputRef.current._onLabelPress()
            : undefined
        )= label
    `
    const _description = pug`
      if description
        Span.description(
          styleName=[
            layout,
            layout + '-' + descriptionPosition
          ]
          description
        )= description
    `
    const input = pug`
      Component(
        part='wrapper'
        ref=inputRef
        layout=layout
        _hasError=!!error
        ...props
        ...inputProps
        onFocus=onFocus
        onBlur=onBlur
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
        part='root'
        styleName=[layout]
      )
        if layout === 'rows'
          if labelPosition === 'top'
            = _label
          if descriptionPosition === 'top'
            = _description
            = err
          if labelPosition === 'right'
            Row(vAlign='center')
              = input
              = _label
          else
            = input
          if descriptionPosition === 'bottom'
            = err
            = _description
        else if layout === 'columns'
          Div.leftBlock
            = _label
            = _description
          Div.rightBlock
            = input
            = err
        else if layout === 'pure'
          = input
          = err
    `
  }

  const componentDisplayName = Component.displayName || Component.name

  InputWrapper.displayName = componentDisplayName + 'InputWrapper'

  InputWrapper.defaultProps = merge(
    {},
    Component.defaultProps,
    options
  )

  InputWrapper.propTypes = Object.assign({
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    label: PropTypes.string,
    description: PropTypes.string,
    layout: PropTypes.oneOf(['pure', 'rows', 'columns']),
    options: PropTypes.shape({
      rows: PropTypes.shape({
        labelPosition: PropTypes.oneOf(['top', 'right']),
        descriptionPosition: PropTypes.oneOf(['top', 'bottom'])
      }),
      isLabelColoredWhenFocusing: PropTypes.bool,
      isLabelClickable: PropTypes.bool
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
    align-self flex-start
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
  .leftBlock
  .rightBlock
    flex 1

  .leftBlock
    margin-right 1.5u

  .rightBlock
    margin-left 1.5u

  .columns
    .root&
      flex-direction row
      align-items center

`
