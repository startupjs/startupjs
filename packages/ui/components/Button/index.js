import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Row from '../Row'
import Icon from '../Icon'
import Span from '../Span'
import config from '../../config/rootConfig'
import colorToRGBA from '../../config/colorToRGBA'
import './index.styl'

const { colors } = config
const { heights, outlinedBorderWidth, iconMargins } = config.Button

function Button ({
  style,
  children,
  color,
  variant,
  shape,
  size,
  icon,
  iconColor,
  iconPosition,
  textColor,
  disabled,
  onPress,
  ...props
}) {
  const isFlat = variant === 'flat'
  const _color = colors[color] || color
  const _textColor = colors[textColor] || textColor ||
    (isFlat ? colors.white : _color)
  const _iconColor = colors[iconColor] || iconColor ||
    (isFlat ? colors.white : _color)
  const haveChildren = React.Children.count(children)
  const height = heights[size]
  const rootStyle = { height }
  const rootExtraProps = {}
  const labelStyle = { color: _textColor }
  const iconStyle = {}

  switch (variant) {
    case 'flat':
      rootStyle.backgroundColor = _color
      rootExtraProps.hoverOpacity = 0.5
      rootExtraProps.activeOpacity = 0.25
      break
    case 'outlined':
      rootStyle.borderWidth = outlinedBorderWidth
      rootStyle.borderColor = colorToRGBA(_color, 0.5)
      rootExtraProps.hoverOpacity = 0.05
      rootExtraProps.activeOpacity = 0.25
      break
    case 'text':
      rootExtraProps.hoverOpacity = 0.05
      rootExtraProps.activeOpacity = 0.25
      break
    case 'shadowed':
      rootStyle.backgroundColor = colors.white
      rootExtraProps.level = 2
      rootExtraProps.hoverOpacity = 0.5
      rootExtraProps.activeOpacity = 0.25
      break
  }

  let padding
  const quarterOfHeight = height / 4

  if (haveChildren) {
    padding = height / 2

    switch (iconPosition) {
      case 'left':
        iconStyle.marginRight = iconMargins[size]
        iconStyle.marginLeft = -quarterOfHeight
        break
      case 'right':
        iconStyle.marginLeft = iconMargins[size]
        iconStyle.marginRight = -quarterOfHeight
        break
    }
  } else {
    padding = quarterOfHeight
  }

  if (variant === 'outlined') padding -= outlinedBorderWidth

  rootStyle.paddingLeft = padding
  rootStyle.paddingRight = padding

  return pug`
    Row.root(
      style=[style, rootStyle]
      styleName=[
        size,
        shape,
        { disabled }
      ]
      align='center'
      vAlign='center'
      reverse=iconPosition === 'right'
      variant='highlight'
      underlayColor=_color
      disabled=disabled
      onPress=onPress
      ...rootExtraProps
      ...props
    )
      if icon
        View.iconWrapper(
          style=iconStyle
          styleName=[
            {'with-label': haveChildren},
            iconPosition
          ]
        )
          Icon(icon=icon size=size color=_iconColor)
      if children
        Span.label(
          style=labelStyle
          size=size
          bold
        )= children
  `
}

Button.defaultProps = {
  color: 'dark',
  variant: 'outlined',
  size: 'm',
  shape: 'rounded',
  iconPosition: 'left'
}

Button.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  color: propTypes.string,
  children: propTypes.node,
  variant: propTypes.oneOf(['flat', 'outlined', 'text', 'shadowed']),
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  shape: propTypes.oneOf(['rounded', 'circle', 'squared']),
  textColor: propTypes.string,
  icon: propTypes.object,
  iconPosition: propTypes.oneOf(['left', 'right']),
  iconColor: propTypes.string
}

export default observer(Button)
