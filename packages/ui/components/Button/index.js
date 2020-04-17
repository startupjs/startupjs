import React, { useMemo } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../Span'
import config from '../../config/rootConfig'
import colorToRGBA from '../../config/colorToRGBA'
import './index.styl'

const { colors } = config

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
  pushed, // By some reason prop 'push' was ignored
  ...props
}) {
  const extraCommonStyles = {
    'with-label': typeof children === 'string'
      ? children.length
      : React.Children.count(children)
  }
  const _textColor = useMemo(() => colors[textColor] || textColor, [textColor])
  const _color = useMemo(() => colors[color] || color, [color])

  const _iconsColor = useMemo(() => {
    return colors[iconsColor] || iconsColor ||
      (variant === 'flat' ? colors.white : _color)
  }, [variant, iconsColor, _color])

  const iconsProps = { size, color: _iconsColor }
  const [rootStyles, labelStyles] = useMemo(() => {
    let labelStyles = {}
    let rootStyles = {}

    switch (variant) {
      case 'flat':
        labelStyles.color = _textColor || colors.white
        rootStyles.backgroundColor = _color
        break
      case 'outlined':
        labelStyles.color = _textColor || _color
        rootStyles.borderWidth = 1
        rootStyles.borderColor = colorToRGBA(_color, 0.5)
        break
      case 'text':
        labelStyles.color = _textColor || _color
        break
      case 'shadowed':
        labelStyles.color = _textColor || _color
        rootStyles.backgroundColor = colors.white
        break
    }

    return [rootStyles, labelStyles]
  }, [variant, _textColor, _color])

  const rootExtraProps = {}
  if (variant === 'shadowed') {
    rootExtraProps.level = 2
  }

  const [hoverOpacity, activeOpacity] = useMemo(() => {
    switch (variant) {
      case 'flat':
      case 'shadowed':
        return [0.5, 0.25]
      case 'outlined':
      case 'text':
        return [0.05, 0.25]
    }
  }, [variant])

  return pug`
    Div.root(
      style=[style, rootStyles]
      styleName=[
        size,
        shape,
        { disabled, pushed },
        extraCommonStyles
      ]
      variant='highlight'
      underlayColor=_color
      hoverOpacity=hoverOpacity
      activeOpacity=activeOpacity
      disabled=disabled
      onPress=onPress
      ...rootExtraProps
      ...props
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
  color: 'dark',
  variant: 'outlined',
  size: 'm',
  shape: 'rounded',
  disabled: false
}

Button.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  color: propTypes.string,
  children: propTypes.node,
  disabled: propTypes.bool,
  pushed: propTypes.bool,
  variant: propTypes.oneOf(['flat', 'outlined', 'text', 'shadowed']),
  size: propTypes.oneOf(['s', 'm', 'l', 'xl', 'xxl']),
  shape: propTypes.oneOf(['rounded', 'circle', 'squared']),
  icon: propTypes.object,
  rightIcon: propTypes.object,
  iconsColor: propTypes.string,
  textColor: propTypes.string,
  onPress: propTypes.func
}

export default observer(Button)
