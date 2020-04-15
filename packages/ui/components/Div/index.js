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
  style,
  children,
  underlayColor,
  hoverOpacity,
  activeOpacity,
  disabled,
  level,
  onPress,
  ...props
}) {
  const isClickable = typeof onPress === 'function' && !disabled
  const isUnderlay = !!underlayColor
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
    extraProps.activeOpacity = isUnderlay ? 1 : activeOpacity

    // setup hover and active states styles and props
    if (isInteractive) {
      if (isUnderlay) {
        if (hover) {
          extraStyles.backgroundColor =
            colorToRGBA(underlayColor, hoverOpacity)
        }
        // Order is important because active has higher priority
        if (active) {
          extraStyles.backgroundColor =
            colorToRGBA(underlayColor, activeOpacity)
        }
      } else {
        if (hover) extraStyles.opacity = hoverStateOpacity
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
  hoverOpacity: hoverStateOpacity,
  activeOpacity: activeStateOpacity,
  disabled: false,
  level: 0
}

Div.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  underlayColor: propTypes.string,
  hoverOpacity: propTypes.number,
  activeOpacity: propTypes.number,
  disabled: propTypes.bool,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  onPress: propTypes.func
}

export default observer(Div)
