import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from './../../Div'
import Row from './../../Row'
import Span from './../../Span'
import Icon from './../../Icon'
import config from '../../../config/rootConfig'
import './index.styl'

const { colors } = config

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
  const color = active ? colors.primary : null

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
      style=[style]
      vAlign='center'
      hoverOpacity=0.05
      activeOpacity=0.25
      underlayColor=colors.primary
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
