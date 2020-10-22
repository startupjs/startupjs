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
  activeTabStyle,
  tabStyle,
  children,
  activeBorder,
  bold,
  icon,
  iconPosition,
  onPress,
  activeColor,
  title,
  index,
  ...props
}) {
  const parentProps = useTabsContext()
  let active = parentProps.active === index

  const _iconPosition = iconPosition || parentProps.iconPosition
  const activeItemColor = activeColor || colors.primary
  const color = active ? activeItemColor : colors.mainText
  const borderStyle = { backgroundColor: activeItemColor }
  const _style = active ? activeTabStyle : tabStyle
  const extraProps = {}
  const reverse = _iconPosition === 'right'

  return pug`
    Div.root(
      style=_style
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

      Div.container
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
  onPress: propTypes.func,
  activeColor: propTypes.string
}

export default observer(Tab)
