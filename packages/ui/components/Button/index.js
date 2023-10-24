import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { observer, useIsMountedRef } from 'startupjs'
import PropTypes from 'prop-types'
import colorToRGBA from '../../helpers/colorToRGBA'
import ColorsEnum, { ColorsEnumValues } from '../CssVariables/ColorsEnum'
import Div from '../Div'
import Icon from '../Icon'
import Loader from '../Loader'
import Row from '../Row'
import Span from '../typography/Span'
import themed from '../../theming/themed'
import useColors from '../../hooks/useColors'
import STYLES from './index.styl'

const {
  config: {
    heights, outlinedBorderWidth, iconMargins
  }
} = STYLES

function Button ({
  style,
  iconStyle,
  textStyle,
  children,
  color,
  variant,
  size,
  icon,
  iconPosition,
  disabled,
  hoverStyle,
  activeStyle,
  onPress,
  ...props
}) {
  const isMountedRef = useIsMountedRef()
  const [asyncActive, setAsyncActive] = useState(false)
  const getColor = useColors()

  function getFlatTextColor () {
    return getColor(`text-on-${color}`) || getColor('text-white')
  }

  async function _onPress (event) {
    let resolved = false
    const promise = onPress(event)
    if (!(promise && promise.then)) return
    promise.then(() => { resolved = true })
    await new Promise((resolve) => setTimeout(resolve, 0))
    if (resolved) return
    setAsyncActive(true)
    await promise
    if (!isMountedRef.current) return
    setAsyncActive(false)
  }

  if (!getColor(color)) console.error('Button component: Color for color property is incorrect. Use colors from ColorsEnum')

  const isFlat = variant === 'flat'
  const _color = getColor(color)
  const hasChildren = React.Children.count(children)
  const height = heights[size]
  const rootStyle = { height }
  const rootExtraProps = {}
  const iconWrapperStyle = {}
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

  switch (variant) {
    case 'flat':
      rootStyle.backgroundColor = _color
      break
    case 'outlined':
      rootStyle.borderWidth = outlinedBorderWidth
      rootStyle.borderColor = colorToRGBA(_color, 0.5)
      extraHoverStyle = { backgroundColor: colorToRGBA(_color, 0.05) }
      extraActiveStyle = { backgroundColor: colorToRGBA(_color, 0.25) }
      break
    case 'text':
      extraHoverStyle = { backgroundColor: colorToRGBA(_color, 0.05) }
      extraActiveStyle = { backgroundColor: colorToRGBA(_color, 0.25) }
      break
  }

  let padding
  const quarterOfHeight = height / 4

  if (hasChildren) {
    padding = height / 2

    switch (iconPosition) {
      case 'left':
        iconWrapperStyle.marginRight = iconMargins[size]
        iconWrapperStyle.marginLeft = -quarterOfHeight
        break
      case 'right':
        iconWrapperStyle.marginLeft = iconMargins[size]
        iconWrapperStyle.marginRight = -quarterOfHeight
        break
    }
  } else {
    padding = quarterOfHeight
  }

  if (variant === 'outlined') padding -= outlinedBorderWidth

  rootStyle.paddingLeft = padding
  rootStyle.paddingRight = padding

  return pug`
    Row.root(
      style=[rootStyle, style]
      styleName=[
        size,
        { disabled }
      ]
      align='center'
      vAlign='center'
      reverse=iconPosition === 'right'
      variant='highlight'
      hoverStyle=extraHoverStyle ? [extraHoverStyle, hoverStyle] : hoverStyle
      activeStyle=extraActiveStyle ? [extraActiveStyle, activeStyle] : activeStyle
      disabled=asyncActive || disabled
      onPress=onPress ? _onPress : undefined
      ...rootExtraProps
      ...props
    )
      if asyncActive
        Div.loader
          Loader(size='s' color=isFlat ? 'text-white' : color)
      if icon
        Div.iconWrapper(
          style=iconWrapperStyle
          styleName=[
            { 'with-label': hasChildren },
            iconPosition
          ]
        )
          Icon.icon(
            style=iconStyle
            styleName=[variant, { invisible: asyncActive }]
            icon=icon
            size=size
          )
      if children != null
        Span.label(
          style=[textStyle]
          styleName=[size, { invisible: asyncActive }]
        )= children
  `
}

Button.defaultProps = {
  ...Div.defaultProps,
  color: ColorsEnum.secondary,
  variant: 'outlined',
  size: 'm',
  shape: 'rounded',
  iconPosition: 'left'
}

Button.propTypes = {
  ...Div.propTypes,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  color: PropTypes.oneOf(ColorsEnumValues),
  children: PropTypes.node,
  variant: PropTypes.oneOf(['flat', 'outlined', 'text']),
  size: PropTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  shape: Div.propTypes.shape,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  iconPosition: PropTypes.oneOf(['left', 'right'])
}

export default observer(themed('Button', Button))
