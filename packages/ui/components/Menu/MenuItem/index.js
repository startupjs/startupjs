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
  iconPosition,
  activeBorder,
  onPress,
  ...props
}) {
  const color = active ? colors.primary : null

  const content = React.Children.toArray(children).map((child, index) => {
    const key = `__MENU_ITEM_KEY_${index}__`
    return pug`
      if typeof child === 'string'
        Span(key=key style={color})= child
      else
        = child
    `
  })

  const extraProps = {}
  if (iconPosition === 'right') {
    extraProps.reverse = true
    extraProps.align = 'between'
  }

  return pug`
    Row.root(
      style=[style]
      variant='highlight'
      vAlign='center'
      hoverOpacity=0.05
      activeOpacity=0.25
      underlayColor=colors.primary
      onPress=onPress
      ...extraProps
      ...props
    )
      if activeBorder !== 'none' && active
        Div.border(styleName=[activeBorder])
      if icon
        Icon.icon.left(icon=icon color=color)
      = content
  `
}

MenuItem.defaultProps = {
  active: false,
  iconPosition: 'left'
}

MenuItem.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  active: propTypes.bool,
  icon: propTypes.object,
  iconPosition: propTypes.oneOf(['left', 'right']),
  onPress: propTypes.func
}

export default observer(MenuItem)
