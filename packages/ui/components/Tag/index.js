import React from 'react'
import { StyleSheet } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { colorToRGBA } from '../../helpers'
import Icon from '../Icon'
import Row from '../Row'
import Div from '../Div'
import Span from '../typography/Span'
import STYLES from './index.styl'

const { colors } = STYLES

const ICON_SIZES = {
  m: 's',
  l: 'm'
}

function Tag ({
  style,
  iconStyle,
  secondaryIconStyle,
  textStyle,
  children,
  color,
  variant,
  size,
  icon,
  secondaryIcon,
  disabled,
  hoverStyle,
  activeStyle,
  onPress,
  ...props
}) {
  if (!colors[color]) console.error('Tag component: Color for color property is incorrect. Use colors from $UI.colors')

  const isFlat = variant === 'flat'
  const _color = colors[color]
  const rootStyle = { }
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

  switch (variant) {
    case 'flat':
      rootStyle.backgroundColor = _color
      break
    case 'outlined':
      rootStyle.borderColor = colorToRGBA(_color, 0.5)
      extraHoverStyle = { backgroundColor: colorToRGBA(_color, 0.05) }
      extraActiveStyle = { backgroundColor: colorToRGBA(_color, 0.25) }
      break
  }

  return pug`
    Row.root(
      style=[rootStyle, style]
      styleName=[
        variant,
        size,
        { disabled }
      ]
      align='center'
      vAlign='center'
      variant='highlight'
      hoverStyle=extraHoverStyle ? [extraHoverStyle, hoverStyle] : hoverStyle
      activeStyle=extraActiveStyle ? [extraActiveStyle, activeStyle] : activeStyle
      disabled=disabled
      onPress=onPress
      ...props
    )
      if icon
        Div.iconWrapper.left
          Icon.icon(
            style=iconStyle
            styleName=[variant]
            icon=icon
            size=ICON_SIZES[size]
          )

      if children != null
        Span.label(
          style=[textStyle]
          styleName=[size]
        )= children

      if secondaryIcon
        Div.iconWrapper.right
          Icon.icon(
            style=secondaryIconStyle
            styleName=[variant]
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
  variant: PropTypes.oneOf(['flat', 'outlined']),
  shape: PropTypes.oneOf(['circle', 'rounded']),
  size: PropTypes.oneOf(['m', 'l'])
}

export default observer(Tag)
