import React from 'react'
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

const SHADOWS = config.shadows

const SIZES = {
  normal: 'normal',
  large: 'large',
  big: 'big'
}

const VARIANTS = {
  flat: 'flat',
  outlined: 'outlined',
  ghost: 'ghost',
  shadowed: 'shadowed'
}

const ICON_SIZES = {
  normal: 's',
  large: 'm',
  big: 'xxl'
}

const ICON_COLORS = {
  flat: colors.white,
  outlined: colors.primary,
  ghost: colors.dark,
  shadowed: colors.dark
}

function Button ({
  style,
  children,
  variant,
  circle,
  size,
  squared,
  disabled,
  icon,
  iconProps,
  rightIcon,
  rightIconProps,
  textColor,
  label,
  level,
  onPress,
  ...props
}) {
  const _level = variant === 'shadowed' ? 2 : level
  const isSingleIcon = !!icon && !label

  const labelExtraProps = {}

  if (textColor) {
    labelExtraProps.style = { color: textColor }
  }

  return pug`
    Div.root(
      style=style
      styleName=[
        size,
        variant,
        disabled ? variant + '-disabled' : '',
        isSingleIcon ? variant + '-' + size + '-icon' : '',
        {
          icon: isSingleIcon,
          squared,
          circle
        }
      ]
      level=_level
      disabled=disabled
      onPress=onPress
      ...props
    )
      if !!icon
        Div.leftIcon(
          styleName={single: isSingleIcon}
        )
          Icon(
            icon=icon
            size=iconProps.size || ICON_SIZES[size]
            color=iconProps.color || variant === VARIANTS.outlined && disabled ? colors.darkLighter : ICON_COLORS[variant]
          )
      if label
        Span.label(
          bold
          styleName=[
            size,
            variant,
            disabled ? variant + '-disabled' : ''
          ]

          ...labelExtraProps
        )= label
      if !!rightIcon
        Div.rightIcon
          Icon(
            icon=rightIcon
            size=rightIconProps.size || ICON_SIZES[size]
            color=rightIconProps.color || variant === VARIANTS.outlined && disabled ? colors.darkLighter : ICON_COLORS[variant]
          )
  `
}

Button.defaultProps = {
  disabled: false,
  variant: 'flat',
  level: 0,
  size: 'normal',
  type: 'primary',

  // TODO. remove
  onPress: () => null,
  icon: faStar,
  // rightIcon: faStar,
  iconProps: {},
  rightIconProps: {}
}

const iconsPropTypes = {
  height: propTypes.number,
  width: propTypes.number,
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  color: propTypes.string
}

Button.propTypes = {
  variant: propTypes.oneOf(Object.values(VARIANTS)),
  size: propTypes.oneOf(Object.values(SIZES)),
  circle: propTypes.bool,
  squared: propTypes.bool,
  iconProps: propTypes.shape(iconsPropTypes),
  rightIconProps: propTypes.shape(iconsPropTypes),
  disabled: propTypes.bool,
  label: propTypes.string,
  level: propTypes.oneOf(SHADOWS.map((item, index) => index)),
  textColor: propTypes.string,
  onPress: propTypes.func.isRequired
}

export default observer(Button)
