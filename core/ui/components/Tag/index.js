import React from 'react'
import { StyleSheet } from 'react-native'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import colorToRGBA from '../../helpers/colorToRGBA'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../typography/Span'
import Colors from '../../theming/Colors'
import themed from '../../theming/themed'
import useColors from '../../hooks/useColors'
import './index.styl'

const ICON_SIZES = {
  s: 's',
  m: 's'
}

function Tag ({
  style,
  textStyle,
  children,
  color,
  variant,
  size,
  icon,
  iconStyle,
  secondaryIcon,
  secondaryIconStyle,
  disabled,
  hoverStyle,
  activeStyle,
  onPress,
  onIconPress,
  onSecondaryIconPress,
  ...props
}) {
  const getColor = useColors()

  if (!getColor(color)) {
    console.error(
      'Tag component: Color for color property is incorrect. ' +
      'Use colors from Colors'
    )
  }

  const isFlat = variant === 'flat'
  const _color = getColor(color)
  const rootStyle = {}
  let extraHoverStyle
  let extraActiveStyle

  textStyle = StyleSheet.flatten([
    { color: isFlat ? getFlatTextColor() : _color },
    textStyle
  ])
  iconStyle = StyleSheet.flatten([
    { color: isFlat ? getFlatTextColor() : _color },
    iconStyle
  ])
  secondaryIconStyle = StyleSheet.flatten([
    { color: isFlat ? getFlatTextColor() : _color },
    secondaryIconStyle
  ])

  switch (variant) {
    case 'flat':
      rootStyle.backgroundColor = _color
      break
    case 'outlined':
      rootStyle.borderColor = colorToRGBA(_color, 0.5)
      extraHoverStyle = { backgroundColor: colorToRGBA(_color, 0.05) }
      extraActiveStyle = { backgroundColor: colorToRGBA(_color, 0.25) }
      break
    case 'outlined-bg':
      rootStyle.borderColor = _color
      rootStyle.backgroundColor = colorToRGBA(_color, 0.15)
      extraHoverStyle = { backgroundColor: colorToRGBA(_color, 0.05) }
      extraActiveStyle = { backgroundColor: colorToRGBA(_color, 0.25) }
      break
  }

  function getFlatTextColor () {
    return getColor(`text-on-${color}`) || getColor('text-on-color')
  }

  return pug`
    Div.root(
      style=[rootStyle, style]
      styleName=[
        variant,
        size,
        { disabled }
      ]
      variant='highlight'
      hoverStyle=extraHoverStyle ? [extraHoverStyle, hoverStyle] : hoverStyle
      activeStyle=extraActiveStyle ? [extraActiveStyle, activeStyle] : activeStyle
      disabled=disabled
      onPress=onPress
      ...props
    )
      if icon
        Div.iconWrapper.left(
          styleName=[size]
          onPress=onIconPress
        )
          Icon(
            style=iconStyle
            icon=icon
            size=ICON_SIZES[size]
          )

      //- workaround when we interpolate variable into component
      //- const value = 0
      //- Tag= value
      if children != null
        Span.label(
          style=[textStyle]
          styleName=[size]
        )= children

      if secondaryIcon
        Div.iconWrapper.right(
          styleName=[size]
          onPress=onSecondaryIconPress
        )
          Icon.icon(
            style=secondaryIconStyle
            styleName=[variant, size]
            icon=secondaryIcon
            size=ICON_SIZES[size]
          )
  `
}

Tag.defaultProps = {
  ...Div.defaultProps,
  color: Colors.primary,
  variant: 'flat',
  size: 'm',
  shape: 'circle'
}

Tag.propTypes = {
  ...Div.propTypes,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  secondaryIconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  variant: PropTypes.oneOf(['flat', 'outlined', 'outlined-bg']),
  color: PropTypes.string,
  shape: PropTypes.oneOf(['circle', 'rounded']),
  size: PropTypes.oneOf(['s', 'm']),
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  secondaryIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onIconPress: PropTypes.func,
  onSecondaryIconPress: PropTypes.func
}

export default observer(themed('Tag', Tag))
