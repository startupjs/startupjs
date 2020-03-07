import React, { useMemo, useState } from 'react'
import { View, Platform } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Span from '../Span'
import Icon from '../Icon'
import colorToRGBA from '../../config/colorToRGBA'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config
const ICON_PROPS = {
  size: 'xs'
}
const isWeb = Platform.OS === 'web'

function Tag ({
  style,
  children,
  color,
  variant,
  shape,
  icon,
  rightIcon,
  iconsColor,
  textColor,
  onPress,
  ...props
}) {
  const [hover, setHover] = useState()
  const [active, setActive] = useState()

  if (variant === 'circle') {
    console.warn(`[UI] Property "variant" with type "circle" is DEPRECATED and will be removed in a future version.
Please use property "shape" with type "circle" instead.`)
  }
  if (variant === 'rounded') {
    console.warn(`[UI] Property "variant" with type "rounded" is DEPRECATED and will be removed in a future version.
Please use property "shape" with type "rounded" instead.`)
  }

  const isClickable = typeof onPress === 'function'

  const _textColor = colors[textColor] || textColor
  const _color = colors[color] || color
  const _iconsColor = colors[iconsColor] || iconsColor ||
    (variant === 'outlined' ? _color : colors.white)

  if (isClickable) {
    const { onMouseEnter, onMouseLeave, onPressIn, onPressOut } = props

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

    props.onPressIn = (...args) => {
      setActive(true)
      onPressIn && onPressIn(...args)
    }

    props.onPressOut = (...args) => {
      setActive()
      onPressOut && onPressOut(...args)
    }
  }

  const [rootStyles, labelStyles] = useMemo(() => {
    let labelStyles = {}
    let rootStyles = {}

    if (variant === 'outlined') {
      labelStyles.color = _textColor || _color
      rootStyles.borderWidth = 1
      rootStyles.borderColor = colorToRGBA(_color, 0.5)
    } else {
      labelStyles.color = _textColor || colors.white
    }
    return [rootStyles, labelStyles]
  }, [variant, _textColor, _color])

  const backgroundColor = useMemo(() => {
    if (variant === 'outlined') {
      // Order is important because active has higher priority
      if (active) return colorToRGBA(_color, 0.25)
      if (hover) return colorToRGBA(_color, 0.5)
    } else {
      if (active) return colorToRGBA(_color, 0.25)
      if (hover) return colorToRGBA(_color, 0.05)
      return _color
    }
  }, [variant, hover, active, _color])

  // If component become not clickable
  // while hover or active, state wouldn't update without this effect
  useDidUpdate(() => {
    if (!isClickable) {
      setHover()
      setActive()
    }
  }, [isClickable])

  const iconWrapperStyle = { 'with-label': React.Children.count(children) }

  return pug`
    Div.root(
      style=[style, rootStyles, { backgroundColor }]
      styleName=[color, shape]
      interactive=false
      onPress=onPress
      ...props
    )
      if icon
        View.leftIconWrapper(styleName=[iconWrapperStyle])
          Icon(icon=icon color=_iconsColor ...ICON_PROPS)
      if children
        Span.label(style=labelStyles bold size='xs')= children
      if rightIcon
        View.rightIconWrapper(styleName=[iconWrapperStyle])
          Icon(icon=rightIcon color=_iconsColor ...ICON_PROPS)
  `
}

Tag.defaultProps = {
  color: 'primary',
  variant: 'flat',
  shape: 'circle'
}

Tag.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  color: propTypes.string,
  textColor: propTypes.string,
  iconsColor: propTypes.string,
  variant: propTypes.oneOf(['flat', 'outlined', 'circle', 'rounded']),
  shape: propTypes.oneOf(['circle', 'rounded'])
}

export default observer(Tag)
