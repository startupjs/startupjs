import React, { useState, useMemo } from 'react'
import propTypes from 'prop-types'
import { TouchableOpacity, View } from 'react-native'
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
  const wrapperExtraStyles = useMemo(() => {
    if (!_backgroundColor) return {}
    if (!hover) return { backgroundColor: _backgroundColor }
    return { backgroundColor: colorToRGBA(_backgroundColor, hoverOpacity) }
  }, [hover, _backgroundColor])

  const isClickable = typeof onPress === 'function' && !disabled
  let Wrapper = isClickable
    ? TouchableOpacity
    : View

  const extraProps = {}

  if (isClickable) {
    extraProps.activeOpacity = activeStateOpacity
    extraProps.onPress = onPress

    extraProps.onMouseEnter = (...args) => {
      setHover(true)
      onMouseEnter && onMouseEnter(...args)
    }
    extraProps.onMouseLeave = (...args) => {
      setHover()
      onMouseLeave && onMouseLeave(...args)
    }
  }

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
  style: propTypes.object,
  children: propTypes.node,
  backgroundColor: propTypes.string,
  disabled: propTypes.bool,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  onPress: propTypes.func
}

export default observer(Div)
