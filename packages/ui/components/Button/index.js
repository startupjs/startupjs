import React, { useState, useEffect } from 'react'
import { observer } from 'startupjs'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Icon from '../Icon'
import Row from '../Row'
import Div from '../Div'
import Span from '../typography/Span'
import { colorToRGBA } from '../../Helpers'
import STYLES from './index.styl'

const {
  config: {
    heights, outlinedBorderWidth, iconMargins
  },
  colors
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
  onPress = () => {},
  ...props
}) {
  const isAsync = onPress.constructor.name === 'AsyncFunction'

  const [asyncActive, setAsyncActive] = useState(false)
  const [dots, setDots] = useState(['•'])
  const [timerId, setTimerId] = useState()

  const asyncOnPress = async () => {
    setAsyncActive(true)
    await onPress()
    setAsyncActive(false)
  }

  useEffect(() => {
    if (asyncActive && !timerId) {
      const localDots = dots.slice()
      const interval = setInterval(() => {
        if (localDots.length <= 2) {
          localDots.push('•')
        } else if (localDots.length === 3) {
          localDots.splice(1, 2)
        }
        setDots([...localDots])
      }, 1000)
      setTimerId(interval)
    } else if (!asyncActive) {
      clearInterval(timerId)
      setTimerId()
      setDots(['•'])
    }
  }, [JSON.stringify(dots), asyncActive])

  if (!colors[color]) console.error('Button component: Color for color property is incorrect. Use colors from $UI.colors')

  const isFlat = variant === 'flat'
  const _color = colors[color]
  const hasChildren = React.Children.count(children)
  const height = heights[size]
  const rootStyle = { height }
  const rootExtraProps = {}
  const iconWrapperStyle = {}

  textStyle = StyleSheet.flatten([
    { color: isFlat ? colors.white : _color },
    textStyle
  ])
  iconStyle = StyleSheet.flatten([
    { color: isFlat ? colors.white : _color },
    iconStyle
  ])
  const loaderTranslateStyle = {
    transform: [
      { translateY: '-50%' },
      { translateX: '-25%' }
    ]
  }

  switch (variant) {
    case 'flat':
      rootStyle.backgroundColor = _color
      break
    case 'outlined':
      rootStyle.borderWidth = outlinedBorderWidth
      rootStyle.borderColor = colorToRGBA(_color, 0.5)
      break
    case 'text':
      break
    case 'shadowed':
      rootStyle.backgroundColor = colors.white
      rootExtraProps.level = 2
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
    Div
      if asyncActive
        Span.label.load(
          style=[loaderTranslateStyle]
          styleName=[size]
        )= dots.join('') 
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
        underlayColor=_color
        disabled=asyncActive || disabled
        onPress=isAsync ? asyncOnPress : onPress
        ...rootExtraProps
        ...props
      )
        if icon
          Div.iconWrapper(
            style=iconWrapperStyle
            styleName=[
              {'with-label': hasChildren},
              iconPosition
            ]
          )
            Icon.icon(
              style=iconStyle
              styleName=[variant, {'opacity': asyncActive}]
              icon=icon
              size=size
            )
        if children
          Span.label(
            style=[textStyle]
            styleName=[size, {'opacity': asyncActive}]
          )= children
  `
}

Button.defaultProps = {
  ...Div.defaultProps,
  color: 'dark',
  variant: 'outlined',
  size: 'm',
  shape: 'rounded',
  iconPosition: 'left'
}

Button.propTypes = {
  ...Div.propTypes,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  color: PropTypes.oneOf(Object.keys(colors)),
  children: PropTypes.node,
  variant: PropTypes.oneOf(['flat', 'outlined', 'text', 'shadowed']),
  size: PropTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  shape: Div.propTypes.shape,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  iconPosition: PropTypes.oneOf(['left', 'right'])
}

export default observer(Button)
