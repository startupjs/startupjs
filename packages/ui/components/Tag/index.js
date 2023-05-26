import React from 'react'
import { StyleSheet } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import colorToRGBA from '../../helpers/colorToRGBA'
import Icon from '../Icon'
import Div from '../Div'
import Span from '../typography/Span'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const { colors } = STYLES

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
  if (!colors[color]) {
    console.error(
      'Tag component: Color for color property is incorrect. ' +
      'Use colors from $UI.colors'
    )
  }

  const isFlat = variant === 'flat'
  const _color = colors[color]
  const rootStyle = {}
  let extraHoverStyle
  let extraActiveStyle

  textStyle = StyleSheet.flatten([
    { color: isFlat ? colors.white : _color },
    textStyle
  ])
  iconStyle = StyleSheet.flatten([
    { color: isFlat ? colors.white : _color },
    iconStyle
  ])
  secondaryIconStyle = StyleSheet.flatten([
    { color: isFlat ? colors.white : _color },
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
          Icon.icon(
            style=iconStyle
            styleName=[variant]
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
  color: 'primary',
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
  color: PropTypes.oneOf(Object.keys(colors)),
  shape: PropTypes.oneOf(['circle', 'rounded']),
  size: PropTypes.oneOf(['s', 'm']),
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  secondaryIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onIconPress: PropTypes.func,
  onSecondaryIconPress: PropTypes.func
}

export default observer(themed('Tag', Tag))
