import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../../Div'
import Link from './../../Link'
import Icon from './../../Icon'
import Span from './../../typography/Span'
import { useMenuContext } from './../menuContext'
import STYLES from './index.styl'

const { colors } = STYLES

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
  // TODO: prevent click if already active (for link and for div)
  const parentProps = useMenuContext()
  const _iconPosition = iconPosition || parentProps.iconPosition
  const activeItemColor = activeColor || colors.primary
  const color = active ? activeItemColor : colors.mainText
  const borderStyle = { backgroundColor: activeItemColor }
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
      onPress=onPress
      ...extraProps
      ...props
    )
      if activeBorder !== 'none' && active
        Div.border(styleName=[activeBorder] style=borderStyle)
      if icon
        Icon.icon(styleName=[_iconPosition] icon=icon style={color})

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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  to: PropTypes.string,
  children: PropTypes.node,
  active: PropTypes.bool,
  bold: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onPress: PropTypes.func,
  activeColor: PropTypes.string
}

export default observer(MenuItem)
