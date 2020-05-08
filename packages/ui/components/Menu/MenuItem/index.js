import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from './../../Div'
import Row from './../../Row'
import Span from './../../Typography/Span'
import Icon from './../../Icon'
import Link from './../../Link'
import config from '../../../config/rootConfig'
import './index.styl'

const { colors } = config

function MenuItem ({
  style,
  to,
  children,
  active,
  icon,
  iconPosition,
  activeBorder,
  onPress,
  ...props
}) {
  const color = active ? colors.primary : colors.mainText

  function getContent () {
    return React.Children.map(children, (child, index) => {
      const key = `__MENU_ITEM_KEY_${index}__`
      return pug`
        if typeof child === 'string'
          Span(key=key style={color})= child
        else
          = child
      `
    })
  }

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
      onPress=to ? () => {} : onPress
      ...extraProps
      ...props
    )
      if activeBorder !== 'none' && active
        Div.border(styleName=[activeBorder])
      if icon
        Icon.icon.left(icon=icon color=color)

      if to
        Link.link(style={color} to=to block)= children
      else
        = getContent()
  `
}

MenuItem.defaultProps = {
  active: false,
  iconPosition: 'left'
}

MenuItem.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  to: propTypes.string,
  children: propTypes.node,
  active: propTypes.bool,
  icon: propTypes.object,
  iconPosition: propTypes.oneOf(['left', 'right']),
  onPress: propTypes.func
}

export default observer(MenuItem)
