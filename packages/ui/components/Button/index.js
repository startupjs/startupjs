import React, { useState, useMemo } from 'react'
import { View, Platform } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../Span'
import config from '../../config/rootConfig'
import colorToRGBA from '../../config/colorToRGBA'
import './index.styl'

const { colors } = config
const ICON_SIZES = {
  m: 's',
  l: 'm',
  xl: 'l'
}
const isWeb = Platform.OS === 'web'

function Button ({
  style,
  children,
  color,
  variant,
  disabled,
  shape,
  size,
  icon,
  iconsColor,
  rightIcon,
  textColor,
  onPress,
  ...props
}) {
  const [active, setActive] = useState()

  const [hover, setHover] = useState()
  const extraCommonStyles = { 'with-label': React.Children.count(children) }
  const _textColor = useMemo(() => colors[textColor] || textColor, [textColor])
  const _color = useMemo(() => colors[color] || color, [color])

  const _iconsColor = useMemo(() => {
    return colors[iconsColor] || iconsColor ||
      (variant === 'flat' ? colors.white : _color)
  }, [variant, iconsColor, _color])

  const iconsProps = useMemo(() => {
    return {
      size: ICON_SIZES[size],
      color: _iconsColor
    }
  }, [size, _iconsColor])

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
  }, [variant, _textColor, _color, hover])

  const backgroundStyle = useMemo(() => {
    let backgroundColor
    switch (variant) {
      case 'flat':
        backgroundColor = _color
        if (hover) backgroundColor = colorToRGBA(_color, 0.5)
        if (active) backgroundColor = colorToRGBA(_color, 0.25)
        break
      case 'outlined':
      case 'ghost':
        if (hover) backgroundColor = colorToRGBA(_color, 0.05)
        if (active) backgroundColor = colorToRGBA(_color, 0.25)
        break
      case 'shadowed':
        backgroundColor = colors.white
        if (hover) backgroundColor = colorToRGBA(colors.white, 0.5)
        if (active) backgroundColor = colorToRGBA(colors.white, 0.25)
    }
    if (!backgroundColor) return {}
    return { backgroundColor }
  }, [variant, hover, active, _color])

  const rootExtraProps = {
    onPressIn: () => !disabled && setActive(true),
    onPressOut: () => active && setActive()
  }
  if (isWeb) {
    rootExtraProps.onMouseEnter = () => !disabled && setHover(true)
    rootExtraProps.onMouseLeave = () => hover && setHover()
  }
  if (variant === 'shadowed') {
    rootExtraProps.level = 2
  }

  return pug`
    Div.root(
      style=[style, rootStyles, backgroundStyle]
      styleName=[
        size,
        shape,
        { disabled },
        extraCommonStyles
      ]
      disabled=disabled
      onPress=onPress
      interactive=false
      ...props
      ...rootExtraProps
    )
      if icon
        View.leftIconWrapper(styleName=[extraCommonStyles])
          Icon(icon=icon ...iconsProps)
      if children
        Span.label(
          style=labelStyles
          size=size
          bold
        )= children
      if rightIcon
        View.rightIconWrapper(styleName=[extraCommonStyles])
          Icon(icon=rightIcon ...iconsProps)
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
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  color: propTypes.string,
  children: propTypes.node,
  disabled: propTypes.bool,
  variant: propTypes.oneOf(['flat', 'outlined', 'ghost', 'shadowed']),
  size: propTypes.oneOf(['m', 'l', 'xl']),
  shape: propTypes.oneOf(['rounded', 'circle', 'squared']),
  icon: propTypes.object,
  rightIcon: propTypes.object,
  iconsColor: propTypes.string,
  textColor: propTypes.string,
  onPress: propTypes.func.isRequired
}

export default observer(Button)
