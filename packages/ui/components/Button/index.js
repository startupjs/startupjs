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

const VARIANTS = {
  flat: 'flat',
  outlined: 'outlined',
  ghost: 'ghost',
  shadowed: 'shadowed'
}

const ICON_SIZES = {
  normal: 's',
  large: 'l',
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
  label,
  variant,
  size,
  circle,
  squared,
  icon,
  iconProps,
  iconRight,
  iconRightProps,
  textColor,
  disabled,
  onPress,
  ...props
}) {
  const isSingleIcon = !!icon && !label // ?

  const extraProps = {}
  if (variant === 'shadowed') extraProps.level = 2

  const labelExtraProps = {}
  if (textColor) labelExtraProps.style = { color: textColor }

  return pug`
    Div.root(
      style=style
      styleName=[
        size,
        variant,
        disabled ? variant + '-disabled' : '',
        isSingleIcon ? 'icon-' + size : '',
        {
          icon: isSingleIcon,
          squared,
          circle
        }
      ]
      disabled=disabled
      onPress=onPress
      ...extraProps
      ...props
    )
      if icon
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
      if iconRight
        Icon(
          icon=iconRight
          size=iconRightProps.size || ICON_SIZES[size]
          color=iconRightProps.color || variant === VARIANTS.outlined && disabled ? colors.darkLighter : ICON_COLORS[variant]
        )
  `
}

Button.defaultProps = {
  variant: 'flat',
  size: 'normal',
  // TODO. remove
  icon: faStar,
  iconProps: {},
  iconRight: faStar,
  iconRightProps: {},
  disabled: false,
  onPress: () => null
}

const iconsPropTypes = {
  height: propTypes.number,
  width: propTypes.number,
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  color: propTypes.string
}

Button.propTypes = {
  label: propTypes.string,
  variant: propTypes.oneOf(Object.values(VARIANTS)),
  size: propTypes.oneOf(['normal', 'large', 'biggest']),
  circle: propTypes.bool,
  squared: propTypes.bool,
  icon: propTypes.object,
  iconProps: propTypes.shape(iconsPropTypes),
  iconRight: propTypes.object,
  iconRightProps: propTypes.shape(iconsPropTypes), // ?
  textColor: propTypes.string,
  disabled: propTypes.bool,
  onPress: propTypes.func.isRequired
}

export default observer(Button)
