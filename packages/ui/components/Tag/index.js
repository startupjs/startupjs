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
  icon,
  rightIcon,
  iconsColor,
  textColor,
  onPress,
  ...props
}) {
  const [hover, setHover] = useState()
  const [active, setActive] = useState()
  const isClickable = typeof onPress === 'function'

  const extraProps = useMemo(() => {
    let _props = {}
    if (isClickable) {
      const {
        onMouseEnter,
        onMouseLeave,
        onPressIn,
        onPressOut
      } = props

      if (isWeb) {
        _props.onMouseEnter = (...args) => {
          setHover(true)
          onMouseEnter && onMouseEnter(...args)
        }

        _props.onMouseLeave = (...args) => {
          setHover()
          onMouseLeave && onMouseLeave(...args)
        }
      }

      _props.onPressIn = (...args) => {
        setActive(true)
        onPressIn && onPressIn(...args)
      }

      _props.onPressOut = (...args) => {
        setActive()
        onPressOut && onPressOut(...args)
      }
    }
    return _props
  }, [isClickable])

  const _backgroundColor = useMemo(() => {
    const backgroundColor = colors[color] || color

    // Order is important because active has higher priority
    if (active) return colorToRGBA(backgroundColor, 0.25)
    if (hover) return colorToRGBA(backgroundColor, 0.5)

    return backgroundColor
  }, [hover, active, color])

  // If component become not clickable
  // while hover or active, state wouldn't update without this effect
  useDidUpdate(() => {
    if (!isClickable) {
      setHover()
      setActive()
    }
  }, [isClickable])

  const _textColor = colors[textColor] || textColor || colors.white
  const _iconsColor = colors[iconsColor] || iconsColor || colors.white

  const iconWrapperStyle = { 'with-label': React.Children.count(children) }

  return pug`
    Div.root(
      style=[style, { backgroundColor: _backgroundColor}]
      styleName=[color, variant]
      interactive=false
      onPress=onPress
      ...props
      ...extraProps
    )
      if icon
        View.leftIconWrapper(styleName=[iconWrapperStyle])
          Icon(icon=icon color=_iconsColor ...ICON_PROPS)
      if children
        Span.label(style={color: _textColor} bold size='xs')= children
      if rightIcon
        View.rightIconWrapper(styleName=[iconWrapperStyle])
          Icon(icon=rightIcon color=_iconsColor ...ICON_PROPS)
  `
}

Tag.defaultProps = {
  color: 'primary',
  variant: 'circle'
}

Tag.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  color: propTypes.string,
  textColor: propTypes.string,
  iconsColor: propTypes.string,
  variant: propTypes.oneOf(['circle', 'rounded'])
}

export default observer(Tag)
