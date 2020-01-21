import React from 'react'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../Span'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import config from '../../config/rootConfig'
import './index.styl'

const SHADOWS = config.shadows

function Button ({
  style,
  children,
  variant,
  size,
  squared,
  disabled,
  icon,
  iconType,
  iconSize,
  iconColor,
  label = 'Button',
  level,
  onPress,
  ...props
}) {
  return pug`
    Div.root(
      style=style
      styleName=[
        size,
        variant,
        disabled ? variant + '-disabled' : '',
        {
          squared,
          icon
        }
      ]
      level=level
      disabled=disabled
      onPress=!disabled && onPress
      ...props
    )
      if icon
        Icon.icon(name=icon type=iconType size=iconSize color=iconColor)
      if label
        Span.label(
          bold
          styleName=[
            size,
            variant,
            disabled ? variant + '-disabled' : ''
          ]
        )= label
  `
}

Button.defaultProps = {
  disabled: false,
  variant: 'flat',
  level: 0,
  size: 'normal',

  // TODO. remove
  onPress: () => null
}

Button.propTypes = {
  variant: propTypes.oneOf(['flat', 'outlined', 'ghost']),
  size: propTypes.oneOf(['normal', 'large', 'big']),
  squared: propTypes.bool,
  disabled: propTypes.bool,
  icon: propTypes.string,
  iconType: propTypes.string,
  iconSize: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  iconColor: propTypes.string,
  label: propTypes.string,
  level: propTypes.oneOf(SHADOWS.map((item, index) => index)),
  onPress: propTypes.func.isRequired
}

export default observer(Button)
