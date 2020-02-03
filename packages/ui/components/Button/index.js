import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../Span'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

const ICON_SIZES = {
  s: 's',
  m: 's',
  l: 'm',
  xl: 'm'
}

function Button ({
  style,
  children,
  color,
  variant,
  disabled,
  shape,
  size,
  textColor,
  icon,
  iconColor,
  rightIcon,
  rightIconColor,
  onPress,
  ...props
}) {
  const _color = colors[color] || color
  const _labelColor = textColor || _color
  const extraCommonStyles = { 'with-label': React.Children.count(children) }

  let wrapperStyles = {}
  let labelStyles = {}
  const iconProps = { size: ICON_SIZES[size] }
  const rightIconProps = { size: ICON_SIZES[size] }

  switch (variant) {
    case 'flat':
      wrapperStyles = {
        backgroundColor: _color
      }
      iconProps.color = iconColor || colors.white
      rightIconProps.color = rightIconColor || colors.white
      labelStyles = { color: textColor || colors.white }
      break
    case 'outlined':
      wrapperStyles = { borderColor: _color }
      iconProps.color = iconColor || _color
      rightIconProps.color = rightIconColor || _color
      labelStyles = { color: _labelColor }
      break
    case 'ghost':
      iconProps.color = iconColor || _color
      rightIconProps.color = rightIconColor || _color
      labelStyles = { color: _labelColor }
  }

  return pug`
    Div.root(
      style=[style, wrapperStyles]
      styleName=[
        size,
        variant,
        shape,
        { disabled, 'with-icon': icon || rightIcon },
        extraCommonStyles
      ]
      disabled=disabled
      onPress=onPress
      ...props
    )
      if icon
        View.leftIconWrapper(styleName=[extraCommonStyles])
          Icon(icon=icon ...iconProps)
      if children
        Span.label(
          style=labelStyles
          styleName=[variant]
          size=size
          bold
        )= children
      if rightIcon
        View.rightIconWrapper(styleName=[extraCommonStyles])
          Icon(icon=rightIcon ...rightIconProps)
  `
}

Button.defaultProps = {
  color: 'primary',
  variant: 'flat',
  size: 'm',
  shape: 'rounded',
  disabled: false
}

Button.propTypes = {
  color: propTypes.string,
  children: propTypes.node,
  variant: propTypes.oneOf(['flat', 'outlined', 'ghost']),
  size: propTypes.oneOf(['s', 'm', 'l', 'xl']),
  shape: propTypes.oneOf(['rounded', 'circle', 'squared']),
  textColor: propTypes.string,
  icon: propTypes.object,
  iconColor: propTypes.string,
  rightIcon: propTypes.object,
  rightIconColor: propTypes.string,
  disabled: propTypes.bool,
  onPress: propTypes.func.isRequired
}

export default observer(Button)
