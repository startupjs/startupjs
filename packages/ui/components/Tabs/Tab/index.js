import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../../Div'
import Icon from '../../Icon'
import Span from '../../typography/Span'
import { useTabsContext } from '../tabsContext'
import STYLES from './index.styl'

const { colors } = STYLES

function Tab ({
  activeStyle,
  style,
  children,
  bold,
  icon,
  iconPosition,
  onPress,
  title,
  index,
  ...props
}) {
  const parentProps = useTabsContext()
  let active = parentProps.active === index

  const _iconPosition = iconPosition || parentProps.iconPosition
  const activeItemColor = activeStyle && activeStyle.color ? activeStyle.color : colors.primary
  const color = active ? activeItemColor : colors.mainText
  const borderStyle = { backgroundColor: activeItemColor }
  if (active && activeStyle) style = { style, ...activeStyle }
  const extraProps = {}
  const reverse = _iconPosition === 'right'

  return pug`
    Div.root(
      style=style
      styleName={reverse}
      variant='highlight'
      onPress=onPress
      ...extraProps
      ...props
    )
      if active
        Div.border(style=borderStyle)
      if icon
        Icon.icon(styleName=[_iconPosition] icon=icon color={color})

      Span(style={color} bold=bold)= title
  `
}

Tab.propTypes = {
  tabStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  activeTabStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  active: propTypes.bool,
  bold: propTypes.bool,
  icon: propTypes.oneOfType([propTypes.object, propTypes.func]),
  iconPosition: propTypes.oneOf(['left', 'right']),
  onPress: propTypes.func
}

export default observer(Tab)
