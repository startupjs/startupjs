import React from 'react'
import { View } from 'react-native'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../Span'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import config from '../../config/rootConfig'
import './index.styl'
// TODO. Remove
import { faStar } from '@fortawesome/free-solid-svg-icons'

const { colors } = config

const VARIANTS = {
  flat: 'flat',
  outlined: 'outlined',
  ghost: 'ghost'
}

const ICON_SIZES = {
  m: 's',
  l: 'l',
  xl: 'xxl'
}

function Button ({
  style,
  children,
  color,
  disabled,
  label,
  shape,
  size,
  icon,
  rightIcon,
  textColor,
  variant,
  onPress,
  ...props
}) {
  const isLeftIconSingle = icon && !rightIcon && !label
  const isRightIconSingle = rightIcon && !icon && !label
  const isSingleIcon = isLeftIconSingle || isRightIconSingle

  const labelExtraProps = {}
  if (textColor) labelExtraProps.style = { color: textColor }

  function getIconColor () {
    switch (variant) {
      case 'flat':
        return colors.white
      default:
        return colors[color] || colors.primary
    }
  }

  const iconsColor = getIconColor()

  return pug`
    Div.root(
      style=style
      styleName=[
        size,
        variant,
        shape,
        isSingleIcon ? 'icon-' + size : '',
        color ? variant + '-' + color : '',
        {
          disabled,
          icon: isSingleIcon
        }
      ]
      disabled=disabled
      onPress=onPress
      ...props
    )
      if icon
        View.leftIcon(styleName=[size, color, {['with-label']: !!label}])
          Icon(
            icon=icon
            size=ICON_SIZES[size]
            color=iconsColor
          )
      if label
        Span.label(
          bold
          styleName=[
            size,
            variant,
            color ? variant + '-' + color : ''
          ]
          ...labelExtraProps
        )= label
      if rightIcon
        View.rightIcon(styleName=[size, {['with-label']: !!label}])
          Icon(
            icon=rightIcon
            size=ICON_SIZES[size]
            color=iconsColor
          )
  `
}

Button.defaultProps = {
  color: 'primary',
  variant: 'flat',
  size: 'm',
  shape: 'rounded',

  // TODO. remove
  label: 'Button!',
  icon: faStar,
  rightIcon: faStar,
  disabled: false,
  onPress: () => null
}

Button.propTypes = {
  color: propTypes.oneOf(['primary', 'secondary', 'success']),
  label: propTypes.string,
  variant: propTypes.oneOf(Object.values(VARIANTS)),
  size: propTypes.oneOf(['m', 'l', 'xl']),
  shape: propTypes.oneOf(['rouneded', 'circle', 'squared']),
  icon: propTypes.object,
  rightIcon: propTypes.object,
  textColor: propTypes.string,
  disabled: propTypes.bool,
  onPress: propTypes.func.isRequired
}

export default observer(Button)
