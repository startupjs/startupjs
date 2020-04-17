import React, { useMemo, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Platform
} from 'react-native'
import propTypes from 'prop-types'
import { observer, useDidUpdate } from 'startupjs'
import config from '../../config/rootConfig'
import colorToRGBA from '../../config/colorToRGBA'
import './index.styl'

const SHADOWS = config.shadows
const isWeb = Platform.OS === 'web'
const { hoverStateOpacity, activeStateOpacity } = config.Div

function Div ({
  style = [],
  children,
  variant,
  hoverColor,
  underlayColor,
  hoverOpacity,
  activeOpacity,
  disabled,
  level,
  onPress,
  ...props
}) {
  const isClickable = typeof onPress === 'function' && !disabled
  const isOpacity = variant === 'opacity'
  const Wrapper = isClickable ? TouchableOpacity : View
  const [hover, setHover] = useState()
  const [active, setActive] = useState()
  const isInteractive = useMemo(() => activeOpacity !== 1, [activeOpacity])
  const extraStyles = {}
  const extraProps = {}

  // If component become not clickable, for example received 'disabled'
  // prop while hover or active, state wouldn't update without this effect
  useDidUpdate(() => {
    if (isClickable) return
    if (hover) setHover()
    if (active) setActive()
  }, [isClickable])

  if (isClickable) {
    const { onPressIn, onPressOut } = props

    props.onPressIn = (...args) => {
      setActive(true)
      onPressIn && onPressIn(...args)
    }
    props.onPressOut = (...args) => {
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

    extraProps.onPress = onPress
    extraProps.activeOpacity = isOpacity ? activeOpacity : 1

    // setup hover and active states styles and props
    if (isInteractive) {
      if (isOpacity) {
        if (hover) extraStyles.opacity = hoverStateOpacity
      } else {
        let backgroundColor
        for (let i = style.length - 1; i >= 0; i--) {
          const bg = (style[i] || {}).backgroundColor
          if (bg) {
            backgroundColor = bg
            break
          }
        }

        if (hover) {
          const color = hoverColor || backgroundColor || underlayColor
          extraStyles.backgroundColor =
            colorToRGBA(color || 'transparent', hoverOpacity)
        }
        // Order is important because active has higher priority
        if (active) {
          const color = underlayColor || backgroundColor
          extraStyles.backgroundColor =
            colorToRGBA(color || 'transparent', activeOpacity)
        }
      }
    }
  }

  return pug`
    Wrapper.root(
      style=[style, SHADOWS[level], extraStyles]
      styleName=[{ ['with-shadow']: !!level }]
      ...extraProps
      ...props
    )
      = children
  `
}

Div.defaultProps = {
  variant: 'opacity',
  hoverOpacity: hoverStateOpacity,
  activeOpacity: activeStateOpacity,
  disabled: false,
  level: 0
}

Div.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  variant: propTypes.oneOf(['opacity', 'highlight']),
  hoverColor: propTypes.string,
  underlayColor: propTypes.string,
  hoverOpacity: propTypes.number,
  activeOpacity: propTypes.number,
  disabled: propTypes.bool,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  onPress: propTypes.func
}

export default observer(Div)
