import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import Div from '../Div'
import Span from '../Span'
import Icon from '../Icon'
import propTypes from 'prop-types'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

const ICON_PROPS = {
  size: 'xs'
}

function Tag ({
  style,
  children,
  color,
  variant,
  icon,
  rightIcon,
  iconsColor,
  textColor,
  onPress,
  ...props
}) {
  const _backgroundColor = colors[color] || color
  const _textColor = colors[textColor] || textColor || colors.white
  const _iconsColor = colors[iconsColor] || iconsColor || colors.white

  const iconWrapperStyle = { 'with-label': React.Children.count(children) }

  return pug`
    Div.root(
      style=style
      styleName=[color, variant]
      backgroundColor=_backgroundColor
      onPress=onPress
    )
      if icon
        View.leftIconWrapper(styleName=[iconWrapperStyle])
          Icon(icon=icon color=_iconsColor ...ICON_PROPS)
      if children
        Span.label(style={color: _textColor} bold size='xs')= children
      if rightIcon
        View.rightIconWrapper(styleName=[iconWrapperStyle])
          Icon(icon=rightIcon color=_iconsColor ...ICON_PROPS)
  `
}

Tag.defaultProps = {
  color: 'primary',
  variant: 'circle'
}

Tag.propTypes = {
  style: propTypes.object,
  children: propTypes.string,
  color: propTypes.string,
  textColor: propTypes.string,
  iconsColor: propTypes.string,
  variant: propTypes.oneOf(['circle', 'rounded'])
}

export default observer(Tag)
