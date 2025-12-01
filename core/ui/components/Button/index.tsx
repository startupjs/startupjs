import React, { useState } from 'react'
import { StyleSheet, type ViewProps } from 'react-native'
import { pug, observer, useIsMountedRef } from 'startupjs'
import colorToRGBA from '../../helpers/colorToRGBA'
import Div from '../Div'
import Icon from '../Icon'
import Loader from '../Loader'
import Span from '../typography/Span'
import Colors from '../../theming/Colors'
import themed from '../../theming/themed'
import useColors from '../../hooks/useColors'
import STYLES from './index.styl'

const {
  config: {
    heights, outlinedBorderWidth, iconMargins
  }
} = STYLES

export const _PropsJsonSchema = {/* ButtonProps */} // used in docs generation
export interface ButtonProps extends ViewProps {
  /** color name @default 'secondary' */
  color?: string
  /** variant @default 'outlined' */
  variant?: 'flat' | 'outlined' | 'text'
  /** size @default 'm' */
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'
  /** icon component */
  icon?: React.ComponentType | React.JSXElementConstructor<any>
  /** shape @default 'rounded' */
  shape?: 'squared' | 'rounded' | 'circle'
  /** icon position relative to label @default 'left' */
  iconPosition?: 'left' | 'right'
  /** disable button */
  disabled?: boolean
  /** button label text or a custom react node */
  children?: string | React.ReactNode
  /** custom styles for root element */
  style?: any
  /** custom styles for icon */
  iconStyle?: any
  /** custom styles for label text */
  textStyle?: any
  /** custom styles for hover state */
  hoverStyle?: any
  /** custom styles for active state */
  activeStyle?: any
  /** onPress handler */
  onPress?: (event: any) => void | Promise<void>
}
function Button ({
  style,
  iconStyle,
  textStyle,
  children,
  color = Colors.secondary,
  variant = 'outlined',
  size = 'm',
  shape = 'rounded',
  icon,
  iconPosition = 'left',
  disabled,
  hoverStyle,
  activeStyle,
  onPress,
  ...props
}: ButtonProps) {
  const isMountedRef = useIsMountedRef()
  const [asyncActive, setAsyncActive] = useState(false)
  const getColor = useColors()

  function getFlatTextColorName () {
    return getColor(`text-on-${color}`) ? `text-on-${color}` : 'text-on-color'
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

  if (!getColor(color)) console.error('Button component: Color for color property is incorrect. Use colors from Colors')

  const isFlat = variant === 'flat'
  const _color = getColor(color)
  const textColor = isFlat ? getFlatTextColorName() : color
  const _textColor = getColor(textColor)
  const hasChildren = React.Children.count(children)
  const height = heights[size]
  const rootStyle = { height }
  const rootExtraProps = {}
  const iconWrapperStyle = {}
  let extraHoverStyle
  let extraActiveStyle

  textStyle = StyleSheet.flatten([
    { color: _textColor },
    textStyle
  ])
  iconStyle = StyleSheet.flatten([
    { color: _textColor },
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
    Div.root(
      row
      shape=shape
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
          Loader(size='s' color=textColor)
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

export default observer(themed('Button', Button))
