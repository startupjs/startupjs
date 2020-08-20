import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from './../../Div'
import Link from './../../Link'
import Icon from './../../Icon'
import Span from './../../typography/Span'
import config from '../../../config/rootConfig'
import { useMenuContext } from './../menuContext'
import './index.styl'

const { colors } = config

function MenuItem ({
  style,
  containerStyle,
  children,
  to,
  active,
  activeBorder,
  bold,
  icon,
  iconPosition,
  onPress,
  activeColor,
  ...props
}) {
  const parentProps = useMenuContext()
  const _iconPosition = iconPosition || parentProps.iconPosition
  const activeItemColor = activeColor || colors.primary
  const color = active ? activeItemColor : colors.mainText
  const borderStyle = activeColor && { backgroundColor: activeColor }
  const extraProps = {}
  const reverse = _iconPosition === 'right'
  let Wrapper

  if (to) {
    Wrapper = Link
    extraProps.to = to
    extraProps.block = true
  } else {
    Wrapper = Div
  }

  return pug`
    Wrapper.root(
      style=style
      styleName={reverse}
      variant='highlight'
      hoverOpacity=0.05
      activeOpacity=0.25
      underlayColor=colors.primary
      onPress=onPress
      ...extraProps
      ...props
    )
      if activeBorder !== 'none' && active
        Div.border(styleName=[activeBorder] style=borderStyle)
      if icon
        Icon.icon(styleName=[_iconPosition] icon=icon color=color)

      Div.container(style=containerStyle)
        if typeof children === 'string'
          Span(style={color} bold=bold)= children
        else
          = children
  `
}

MenuItem.defaultProps = {
  active: false
}

MenuItem.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  containerStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  to: propTypes.string,
  children: propTypes.node,
  active: propTypes.bool,
  bold: propTypes.bool,
  icon: propTypes.object,
  iconPosition: propTypes.oneOf(['left', 'right']),
  onPress: propTypes.func,
  activeColor: propTypes.string
}

export default observer(MenuItem)
