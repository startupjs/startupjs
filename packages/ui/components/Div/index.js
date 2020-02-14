import React, { useState, useMemo } from 'react'
import { View, TouchableOpacity } from 'react-native'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import config from '../../config/rootConfig'
import { colorToRGBA } from '../../config/helpers'
import './index.styl'

const { activeStateOpacity, hoverOpacity } = config.Div
const { colors } = config
const SHADOWS = config.shadows

function Div ({
  style,
  children,
  backgroundColor,
  disabled,
  level,
  onMouseLeave,
  onMouseEnter,
  onPress,
  ...props
}) {
  // Shadow does not work without backgorund color
  const _backgroundColor = backgroundColor || (level ? colors.white : null)

  const [hover, setHover] = useState()
  const [active, setActive] = useState()
  const wrapperExtraStyles = useMemo(() => {
    if (!_backgroundColor) return {}
    if (active) {
      return {
        backgroundColor: colorToRGBA(_backgroundColor, activeStateOpacity)
      }
    }
    if (hover) {
      return { backgroundColor: colorToRGBA(_backgroundColor, hoverOpacity) }
    }
    return { backgroundColor: _backgroundColor }
  }, [hover, active, _backgroundColor])

  const isClickable = typeof onPress === 'function' && !disabled

  const extraProps = {}

  if (isClickable) {
    extraProps.activeOpacity = 1
    extraProps.onPress = onPress

    extraProps.onMouseEnter = (...args) => {
      setHover(true)
      onMouseEnter && onMouseEnter(...args)
    }
    extraProps.onMouseLeave = (...args) => {
      setHover()
      onMouseLeave && onMouseLeave(...args)
    }

    extraProps.onPressIn = () => setActive(true)
    extraProps.onPressOut = () => setActive()
  }

  const Wrapper = isClickable ? TouchableOpacity : View

  return pug`
    Wrapper.root(
      style=[style, SHADOWS[level], wrapperExtraStyles]
      styleName=[{
        clickable: isClickable
      }]
      ...extraProps
      ...props
    )
      = children
  `
}

Div.defaultProps = {
  disabled: false,
  level: 0
}

Div.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  backgroundColor: propTypes.string,
  disabled: propTypes.bool,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  onPress: propTypes.func
}

export default observer(Div)
