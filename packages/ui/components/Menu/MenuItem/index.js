import React, { useState, useMemo } from 'react'
import { observer } from 'startupjs'
import { Platform } from 'react-native'
import propTypes from 'prop-types'
import Div from './../../Div'
import Row from './../../Row'
import Span from './../../Span'
import Icon from './../../Icon'
import colorToRGBA from '../../../config/colorToRGBA'
import config from '../../../config/rootConfig'
import './index.styl'

const { colors } = config
const isWeb = Platform.OS === 'web'
const bgInRest = 'transparent'
const interactiveBg = colors.primary

function MenuItem ({
  style,
  children,
  active,
  icon,
  rightIcon,
  activeBorder,
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

  const content = React.Children.toArray(children).map(child => {
    return pug`
      if typeof child === 'string'
        Span(key='__MENU_ITEM_KEY__' style={color})= child
      else
        = child
    `
  })

  return pug`
    Row.root(
      style=[style, { backgroundColor }]
      vAlign='center'
      interactive=false
      onPress=onPress
      ...props
    )
      if activeBorder !== 'none' && active
        Div.border(styleName=[activeBorder])
      if icon
        Icon.icon.left(icon=icon color=color)
      = content
      if rightIcon
        Icon.icon.right(icon=rightIcon color=color)
  `
}

MenuItem.defaultProps = {
  active: false
}

MenuItem.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  active: propTypes.bool,
  icon: propTypes.object,
  rightIcon: propTypes.object,
  onPress: propTypes.func
}

export default observer(MenuItem)
