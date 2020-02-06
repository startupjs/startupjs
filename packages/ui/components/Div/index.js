import React, { useState, useMemo } from 'react'
import propTypes from 'prop-types'
import { TouchableOpacity, View } from 'react-native'
import { observer } from 'startupjs'
import config from '../../config/rootConfig'
import alpha from 'color-alpha'
import './index.styl'

const { opacity } = config

const SHADOWS = config.shadows

function Div ({
  style,
  children,
  backgroundColor,
  disabled,
  level,
  onPress,
  ...props
}) {
  const [hover, setHover] = useState()
  const wrapperExtraStyles = useMemo(() => {
    if (!backgroundColor) return {}
    if (hover) {
      return { backgroundColor: alpha(backgroundColor, opacity.hover) }
    } else {
      return { backgroundColor }
    }
  }, [hover, backgroundColor])

  const isClickable = typeof onPress === 'function' && !disabled
  let Wrapper = isClickable
    ? TouchableOpacity
    : View

  const extraProps = {}

  if (isClickable) {
    extraProps.activeOpacity = config.opacity.active
    extraProps.onPress = onPress

    extraProps.onMouseEnter = () => setHover(true)
    extraProps.onMouseLeave = () => setHover()
  }

  return pug`
    Wrapper.root(
      style=[style, SHADOWS[level], wrapperExtraStyles]
      styleName=[{
        withShadow: !!level,
        clickable: isClickable
      }]
      ...extraProps
      ...props
    )
      View.content
      = children
  `
}

Div.defaultProps = {
  disabled: false,
  level: 0
}

Div.propTypes = {
  backgroundColor: propTypes.string,
  disabled: propTypes.bool,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  onPress: propTypes.func
}

export default observer(Div)
