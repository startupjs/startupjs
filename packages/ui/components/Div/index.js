import React, { useState } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet
} from 'react-native'
import propTypes from 'prop-types'
import { observer, useDidUpdate } from 'startupjs'
import config from '../../config/rootConfig'
import colorToRGBA from '../../config/colorToRGBA'
import './index.styl'

const SHADOWS = config.shadows
const isWeb = Platform.OS === 'web'
const { defaultHoverOpacity, defaultActiveOpacity } = config.Div

function Div ({
  style = [],
  children,
  variant,
  hoverStyle,
  activeStyle,
  disabled,
  level,
  feedback,
  shape,
  pushed, // By some reason prop 'push' was ignored
  bleed,
  onPress,
  onClick,
  ...props
}) {
  const handlePress = onClick || onPress
  const isClickable = typeof handlePress === 'function' && !disabled
  const [hover, setHover] = useState()
  const [active, setActive] = useState()
  let extraStyle = {}
  const extraProps = {}
  const wrapperProps = {}

  // If component become not clickable, for example received 'disabled'
  // prop while hover or active, state wouldn't update without this effect
  useDidUpdate(() => {
    if (isClickable) return
    if (hover) setHover()
    if (active) setActive()
  }, [isClickable])

  if (isClickable) {
    wrapperProps.onPress = handlePress

    // setup hover and active states styles and props
    if (feedback) {
      const { onPressIn, onPressOut } = props
      wrapperProps.onPressIn = (...args) => {
        setActive(true)
        onPressIn && onPressIn(...args)
      }
      wrapperProps.onPressOut = (...args) => {
        setActive()
        onPressOut && onPressOut(...args)
      }

      if (isWeb) {
        const { onMouseEnter, onMouseLeave } = props
        props.onMouseEnter = (...args) => {
          setHover(true)
          onMouseEnter && onMouseEnter(...args)
        }
        props.onMouseLeave = (...args) => {
          setHover()
          onMouseLeave && onMouseLeave(...args)
        }
      }

      if (active) {
        extraStyle = activeStyle || getDefaultStyle(style, 'active', variant)
      } else if (hover) {
        extraStyle = hoverStyle || getDefaultStyle(style, 'hover', variant)
      }
    }
  }

  let pushedModifier
  const pushedSize = typeof pushed === 'boolean' && pushed ? 'm' : pushed
  if (pushedSize) pushedModifier = `pushed-${pushedSize}`

  function maybeWrapToClickable (children) {
    if (isClickable) {
      return pug`
        TouchableWithoutFeedback(
          ...wrapperProps
        )
          = children
      `
    } else {
      return children
    }
  }

  return maybeWrapToClickable(pug`
    View.root(
      style=[style, SHADOWS[level], extraStyle]
      styleName=[
        { ['with-shadow']: !!level, clickable: isWeb && isClickable, bleed },
        shape,
        pushedModifier
      ]
      ...extraProps
      ...props
    )
      = children
  `)
}

Div.defaultProps = {
  variant: 'opacity',
  level: 0,
  feedback: true,
  disabled: false,
  bleed: false,
  pushed: false
}

Div.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  variant: propTypes.oneOf(['opacity', 'highlight']),
  feedback: propTypes.bool,
  hoverStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  activeStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  disabled: propTypes.bool,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  shape: propTypes.oneOf(['squared', 'rounded', 'circle']),
  pushed: propTypes.oneOfType([propTypes.bool, propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl'])]),
  bleed: propTypes.bool,
  onPress: propTypes.func,
  onClick: propTypes.func
}

export default observer(Div)

function getDefaultStyle (style, type, variant) {
  if (variant === 'opacity') {
    if (type === 'hover') return { opacity: defaultHoverOpacity }
    if (type === 'active') return { opacity: defaultActiveOpacity }
  } else {
    style = StyleSheet.flatten(style)
    let backgroundColor = style.backgroundColor
    if (backgroundColor === 'transparent') backgroundColor = undefined

    if (type === 'hover') {
      if (backgroundColor) {
        return { backgroundColor: colorToRGBA(backgroundColor, defaultHoverOpacity) }
      } else {
        // If no color exists, we treat it as a light background and just dim it a bit
        return { backgroundColor: 'rgba(0,0,0,0.05)' }
      }
    }

    if (type === 'active') {
      if (backgroundColor) {
        return { backgroundColor: colorToRGBA(backgroundColor, defaultActiveOpacity) }
      } else {
        // If no color exists, we treat it as a light background and just dim it a bit
        return { backgroundColor: 'rgba(0,0,0,0.2)' }
      }
    }
  }
}
