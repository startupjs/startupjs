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
  icon,
  rightIcon,
  onPress,
  ...props
}) {
  const extraCommonStyles = { 'with-label': React.Children.count(children) }

  const iconProps = {
    size: ICON_SIZES[size],
    color: variant === 'flat' ? colors.white : colors[color]
  }

  return pug`
    Div.root(
      style=style
      styleName=[
        size,
        variant,
        shape,
        color,
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
          styleName=[variant, color]
          size=size
          bold
        )= children
      if rightIcon
        View.rightIconWrapper(styleName=[extraCommonStyles])
          Icon(icon=rightIcon ...iconProps)
  `
}

Button.defaultProps = {
  color: 'primary',
  variant: 'flat',
  size: 'm',
  shape: 'rounded',
  disabled: false,
  onPress: () => null
}

Button.propTypes = {
  color: propTypes.oneOf(['primary', 'secondary', 'success']),
  children: propTypes.node,
  variant: propTypes.oneOf(['flat', 'outlined', 'ghost']),
  size: propTypes.oneOf(['m', 'l', 'xl']),
  shape: propTypes.oneOf(['rounded', 'circle', 'squared']),
  icon: propTypes.object,
  rightIcon: propTypes.object,
  disabled: propTypes.bool,
  onPress: propTypes.func.isRequired
}

export default observer(Button)
