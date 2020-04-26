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
  hoverColor,
  activeColor,
  hoverOpacity,
  activeOpacity,
  disabled,
  level,
  onPress,
  feedback,
  pushed, // By some reason prop 'push' was ignored
  ...props
}) {
  const isClickable = typeof onPress === 'function' && !disabled
  const isOpacity = variant === 'opacity'
  const [hover, setHover] = useState()
  const [active, setActive] = useState()
  const extraStyle = {}
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
    wrapperProps.onPress = onPress

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

      if (isOpacity) {
        if (hover) extraStyle.opacity = hoverOpacity
        if (active) extraStyle.opacity = activeOpacity
      } else {
        style = StyleSheet.flatten(style)
        let backgroundColor = style.backgroundColor
        if (backgroundColor === 'transparent') backgroundColor = undefined

        if (hover) {
          if (!hoverColor) {
            if (backgroundColor) {
              hoverColor = colorToRGBA(backgroundColor, hoverOpacity)
            } else {
              // If no color exists, we treat it as a light background and just dim it a bit
              hoverColor = 'rgba(0,0,0,0.05)'
            }
          }
          extraStyle.backgroundColor = hoverColor
        }

        if (active) {
          if (!activeColor) {
            if (backgroundColor) {
              activeColor = colorToRGBA(backgroundColor, activeOpacity)
            } else {
              // If no color exists, we treat it as a light background and just dim it a bit
              activeColor = 'rgba(0,0,0,0.2)'
            }
          }
          extraStyle.backgroundColor = activeColor
        }
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
      styleName=[{ ['with-shadow']: !!level }, pushedModifier]
      ...extraProps
      ...props
    )
      = children
  `)
}

Div.defaultProps = {
  variant: 'opacity',
  feedback: true,
  hoverOpacity: defaultHoverOpacity,
  activeOpacity: defaultActiveOpacity,
  disabled: false,
  level: 0
}

Div.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  variant: propTypes.oneOf(['opacity', 'highlight']),
  feedback: propTypes.bool,
  hoverColor: propTypes.string,
  activeColor: propTypes.string,
  hoverOpacity: propTypes.number,
  activeOpacity: propTypes.number,
  disabled: propTypes.bool,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  pushed: propTypes.oneOfType([propTypes.bool, propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl'])]),
  onPress: propTypes.func
}

export default observer(Div)
