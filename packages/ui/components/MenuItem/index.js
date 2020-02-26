import React, { useState, useMemo } from 'react'
import { observer } from 'startupjs'
import { Platform } from 'react-native'
import propTypes from 'prop-types'
import Div from './../Div'
import Row from './../Row'
import Span from './../Span'
import Icon from './../Icon'
import colorToRGBA from '../../config/colorToRGBA'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config
const isWeb = Platform.OS === 'web'
const bgInRest = colors.white
const interactiveBg = colors.primary

function MenuItem ({
  style,
  label,
  active,
  icon,
  rightIcon,
  onPress,
  ...props
}) {
  const [hover, setHover] = useState()
  const [pressed, setPressed] = useState()
  const color = active ? colors.primary : null
  const { onMouseEnter, onMouseLeave, onPressIn, onPressOut } = props

  if (isWeb) {
    props.onMouseEnter = (...args) => {
      setHover(true)
      onMouseEnter && onMouseEnter(...args)
    }

    props.onMouseLeave = (...args) => {
      setHover()
      onMouseLeave && onMouseLeave(...args)
    }
  }

  props.onPressIn = (...args) => {
    setPressed(true)
    onPressIn && onPressIn(...args)
  }

  props.onPressOut = (...args) => {
    setPressed()
    onPressOut && onPressOut(...args)
  }

  const backgroundColor = useMemo(() => {
    // Order is important because pressed has higher priority
    if (pressed) return colorToRGBA(interactiveBg, 0.25)
    if (hover) return colorToRGBA(interactiveBg, 0.05)
    return bgInRest
  }, [hover, pressed])

  return pug`
    Div(
      style=[style, { backgroundColor }]
      interactive=false
      ...props
    )
      Row.root(vAlign='center')
        if icon
          Icon.icon.left(icon=icon color=color)
        Span.label(style={color})= label
        if rightIcon
          Icon.icon.right(icon=rightIcon color=color)
  `
}

MenuItem.defaultProps = {
  active: false
}

MenuItem.propTypes = {
  label: propTypes.string,
  active: propTypes.bool,
  icon: propTypes.object,
  onPress: propTypes.func
}

export default observer(MenuItem)
