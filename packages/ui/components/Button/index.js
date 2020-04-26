import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Row from '../Row'
import Div from '../Div'
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
          style=labelStyle
          size=size
          bold
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
  children: propTypes.string,
  variant: propTypes.oneOf(['flat', 'outlined', 'text', 'shadowed']),
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  shape: propTypes.oneOf(['rounded', 'circle', 'squared']),
  textColor: propTypes.string,
  icon: propTypes.object,
  iconPosition: propTypes.oneOf(['left', 'right']),
  iconColor: propTypes.string
}

export default observer(Button)
