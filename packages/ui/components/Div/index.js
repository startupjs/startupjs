import React, { useState } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import PropTypes from 'prop-types'
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet
} from 'react-native'
import { colorToRGBA } from '../../config/helpers'
import STYLES from './index.styl'

const isWeb = Platform.OS === 'web'
const {
  config: {
    defaultHoverOpacity,
    defaultActiveOpacity
  },
  shadows: SHADOWS
} = STYLES

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
  onLongPress,
  onClick,
  ...props
}) {
  const handlePress = onClick || onPress
  const isClickable = (typeof handlePress === 'function' || onLongPress) && !disabled
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
    wrapperProps.onLongPress = onLongPress

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

  // backgroundColor in style can override extraStyle backgroundColor
  // so passing the extraStyle to the end is important in this case
  return maybeWrapToClickable(pug`
    View.root(
      style=[SHADOWS[level], style, extraStyle]
      styleName=[
        {
          ['with-shadow']: !!level,
          clickable: isWeb && isClickable,
          bleed,
          disabled
        },
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  variant: PropTypes.oneOf(['opacity', 'highlight']),
  feedback: PropTypes.bool,
  hoverStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  activeStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disabled: PropTypes.bool,
  level: PropTypes.oneOf(Object.keys(SHADOWS).map(i => ~~i)),
  shape: PropTypes.oneOf(['squared', 'rounded', 'circle']),
  pushed: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl'])]),
  bleed: PropTypes.bool,
  onPress: PropTypes.func,
  onClick: PropTypes.func,
  onLongPress: PropTypes.func
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
        return { backgroundColor: 'rgba(0, 0, 0, 0.05)' }
      }
    }

    if (type === 'active') {
      if (backgroundColor) {
        return { backgroundColor: colorToRGBA(backgroundColor, defaultActiveOpacity) }
      } else {
        // If no color exists, we treat it as a light background and just dim it a bit
        return { backgroundColor: 'rgba(0, 0, 0, 0.2)' }
      }
    }
  }
}
