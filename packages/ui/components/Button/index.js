import React, { useState, useMemo } from 'react'
import { View, Platform } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../Span'
import config from '../../config/rootConfig'
import colorToRGBA from '../../config/colorToRGBA'
import './index.styl'

const { colors } = config
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
  push,
  ...props
}) {
  const [hover, setHover] = useState()
  const [active, setActive] = useState()
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
        break
      case 'outlined':
        labelStyles.color = _textColor || _color
        rootStyles.borderWidth = 1
        rootStyles.borderColor = colorToRGBA(_color, 0.5)
        break
      case 'text':
      case 'shadowed':
        labelStyles.color = _textColor || _color
    }

    return [rootStyles, labelStyles]
  }, [variant, _textColor, _color])

  const backgroundColor = useMemo(() => {
    switch (variant) {
      case 'flat':
        // Order is important because active has higher priority
        if (active) return colorToRGBA(_color, 0.25)
        if (hover) return colorToRGBA(_color, 0.5)
        return _color
      case 'outlined':
      case 'text':
        if (active) return colorToRGBA(_color, 0.25)
        if (hover) return colorToRGBA(_color, 0.05)
        break
      case 'shadowed':
        if (active) return colorToRGBA(colors.white, 0.25)
        if (hover) return colorToRGBA(colors.white, 0.5)
        return colors.white
    }
  }, [variant, hover, active, _color])

  if (!disabled) {
    const { onMouseEnter, onMouseLeave, onPressIn, onPressOut } = props

    props.onPressIn = (...args) => {
      setActive(true)
      onPressIn && onPressIn(...args)
    }
    props.onPressOut = (...args) => {
      setActive()
      onPressOut && onPressOut(...args)
    }

    if (isWeb) {
      props.onMouseEnter = (...args) => {
        setHover(true)
        onMouseEnter && onMouseEnter(...args)
      }
      props.onMouseLeave = (...args) => {
        setHover()
        onMouseLeave && onMouseLeave(...args)
      }
    }
  }

  const rootExtraProps = {}
  if (variant === 'shadowed') {
    rootExtraProps.level = 2
  }

  // If component become not clickable
  // while hover or active, state wouldn't update without this effect
  useDidUpdate(() => {
    if (disabled) {
      setHover()
      setActive()
    }
  }, [disabled])

  return pug`
    Div.root(
      style=[style, rootStyles, {backgroundColor}]
      styleName=[
        size,
        shape,
        { disabled, push },
        extraCommonStyles
      ]
      disabled=disabled
      onPress=onPress
      interactive=false
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
  push: propTypes.bool,
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
