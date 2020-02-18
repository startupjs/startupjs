import React, { useState, useMemo, useEffect } from 'react'
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
  interactive,
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
    if (interactive) {
      if (active) {
        return {
          backgroundColor: colorToRGBA(_backgroundColor, activeStateOpacity)
        }
      }
      if (hover) {
        return {
          backgroundColor: colorToRGBA(_backgroundColor, hoverOpacity)
        }
      }
    }
    return { backgroundColor: _backgroundColor }
  }, [hover, active, _backgroundColor])

  const isClickable = typeof onPress === 'function' && !disabled

  const extraProps = {}

  const isInteractiveWithoutBg = !_backgroundColor && interactive

  if (isClickable) {
    extraProps.activeOpacity = isInteractiveWithoutBg
      ? activeStateOpacity
      : 1

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

  // If component receive 'disabled' prop while hover or active
  // state wouldn't update without this effect
  useEffect(() => {
    if (!isClickable) {
      setHover()
      setActive()
    }
  }, [isClickable])

  return pug`
    Wrapper.root(
      style=[style, SHADOWS[level], wrapperExtraStyles]
      styleName=[{
        clickable: isClickable,
        ['interactive']: isInteractiveWithoutBg
      }]
      ...extraProps
      ...props
    )
      = children
  `
}

Div.defaultProps = {
  disabled: false,
  level: 0,
  interactive: true
}

Div.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  backgroundColor: propTypes.string,
  disabled: propTypes.bool,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  interactive: propTypes.bool,
  onPress: propTypes.func
}

export default observer(Div)
