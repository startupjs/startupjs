import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Row from '../Row'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../Typography/Span'
import config from '../../config/rootConfig'
import colorToRGBA from '../../config/colorToRGBA'
import { StyleSheet } from 'react-native'
import './index.styl'

const { colors } = config
const { heights, outlinedBorderWidth, iconMargins } = config.Button

function Button ({
  style,
  textStyle,
  children,
  color,
  variant,
  size,
  icon,
  iconColor,
  iconPosition,
  textColor,
  disabled,
  onPress,
  ...props
}) {
  if (/^#|rgb/.test(color)) console.warn('Button component: Hex color for color property is deprecated. Use style instead')
  if (/^#|rgb/.test(iconColor)) console.warn('Button component: Hex color for iconColor property is deprecated. Use style instead')
  const isFlat = variant === 'flat'
  style = StyleSheet.flatten([{ color: colors[color] || color }, style])
  const _color = style.color
  const _textColor = colors[textColor] || textColor ||
    (isFlat ? colors.white : _color)
  const _iconColor = colors[iconColor] || iconColor ||
    (isFlat ? colors.white : _color)
  const hasChildren = React.Children.count(children)
  const height = heights[size]
  const rootStyle = { height }
  const rootExtraProps = {}
  const labelStyle = { color: _textColor }
  const iconStyle = {}

  switch (variant) {
    case 'flat':
      rootStyle.backgroundColor = _color
      break
    case 'outlined':
      rootStyle.borderWidth = outlinedBorderWidth
      rootStyle.borderColor = colorToRGBA(_color, 0.5)
      break
    case 'text':
      break
    case 'shadowed':
      rootStyle.backgroundColor = colors.white
      rootExtraProps.level = 2
      break
  }

  let padding
  const quarterOfHeight = height / 4

  if (hasChildren) {
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
        Div.iconWrapper(
          style=iconStyle
          styleName=[
            {'with-label': hasChildren},
            iconPosition
          ]
        )
          Icon(icon=icon size=size color=_iconColor)
      if children
        Span.label(
          style=[labelStyle, textStyle]
          size=size
        )= children
  `
}

Button.defaultProps = {
  ...Div.defaultProps,
  color: 'dark',
  variant: 'outlined',
  size: 'm',
  shape: 'rounded',
  iconPosition: 'left'
}

Button.propTypes = {
  ...Div.propTypes,
  textStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  variant: propTypes.oneOf(['flat', 'outlined', 'text', 'shadowed']),
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  shape: Div.propTypes.shape,
  textColor: propTypes.string,
  icon: propTypes.object,
  iconPosition: propTypes.oneOf(['left', 'right']),
  iconColor: propTypes.string
}

export default observer(Button)
