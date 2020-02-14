import React, { useState, useMemo } from 'react'
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
  xl: 'l'
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
  textColor,
  onPress,
  ...props
}) {
  const [hover, setHover] = useState()
  const extraCommonStyles = { 'with-label': React.Children.count(children) }
  const rootExtraProps = {}
  const _textColor = colors[textColor] || textColor
  const _color = colors[color] || color

  const iconProps = {
    size: ICON_SIZES[size],
    color: variant === 'flat' ? colors.white : _color
  }

  const [rootStyles, labelStyles] = useMemo(() => {
    let labelStyles = {}
    let rootStyles = {}

    switch (variant) {
      case 'flat':
        labelStyles.color = _textColor || colors.white
        break
      case 'outlined':
        labelStyles.color = _textColor || _color
        rootStyles.borderWidth = 1
        rootStyles.borderColor = _color
        break
      case 'ghost':
      case 'shadowed':
        labelStyles.color = _textColor || _color
    }

    return [rootStyles, labelStyles]
  }, [variant, _textColor, _color])

  const backgroundColor = useMemo(() => {
    switch (variant) {
      case 'flat':
        return _color
      case 'outlined':
      case 'ghost':
        return hover ? _color : null
      case 'shadowed':
        return colors.white
    }
  }, [variant, hover, _color])

  if (variant === 'shadowed') {
    rootExtraProps.level = 2
  }

  return pug`
    Div.root(
      style=[style, rootStyles]
      styleName=[
        size,
        shape,
        { disabled },
        extraCommonStyles
      ]
      backgroundColor=backgroundColor
      disabled=disabled
      onMouseEnter=() => setHover(true)
      onMouseLeave=() => setHover()
      onPress=onPress
      ...rootExtraProps
      ...props
    )
      if icon
        View.leftIconWrapper(styleName=[extraCommonStyles])
          Icon(icon=icon ...iconProps)
      if children
        Span.label(
          style=labelStyles
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
  disabled: false
}

Button.propTypes = {
  style: propTypes.object,
  color: propTypes.string,
  children: propTypes.node,
  disabled: propTypes.bool,
  variant: propTypes.oneOf(['flat', 'outlined', 'ghost', 'shadowed']),
  size: propTypes.oneOf(['m', 'l', 'xl']),
  shape: propTypes.oneOf(['rounded', 'circle', 'squared']),
  icon: propTypes.object,
  rightIcon: propTypes.object,
  textColor: propTypes.string,
  onPress: propTypes.func.isRequired
}

export default observer(Button)
