import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Row from '../Row'
import Span from '../Span'
import Icon from '../Icon'
import colorToRGBA from '../../config/colorToRGBA'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config
const STATES_OPACITIES = {
  flat: {
    hoverOpacity: 0.5,
    activeOpacity: 0.25
  },
  outlined: {
    hoverOpacity: 0.05,
    activeOpacity: 0.25
  }
}

function Tag ({
  style,
  children,
  color,
  variant,
  shape,
  icon,
  iconColor,
  iconPosition,
  textColor,
  onPress,
  ...props
}) {
  const isFlat = variant === 'flat'
  const _color = colors[color] || color
  const _textColor = colors[textColor] || textColor ||
    (isFlat ? colors.white : _color)
  const _iconsColor = colors[iconColor] || iconColor ||
    (isFlat ? colors.white : _color)

  const rootStyles = isFlat
    ? { backgroundColor: _color }
    : { borderWidth: 1, borderColor: colorToRGBA(_color, 0.5) }

  const labelStyles = { color: _textColor }

  return pug`
    Row.root(
      style=[style, rootStyles]
      align='center'
      vAlign='center'
      reverse=iconPosition === 'right'
      variant='highlight'
      styleName=[color, shape]
      hoverOpacity=STATES_OPACITIES[variant].hoverOpacity
      activeOpacity=STATES_OPACITIES[variant].activeOpacity
      underlayColor=_color
      onPress=onPress
      ...props
    )
      if icon
        Div.iconWrapper(
          styleName=[
            {'with-label': React.Children.count(children) },
            iconPosition
          ]
        )
          Icon(icon=icon color=_iconsColor size='xs')
      if children
        Span.label(style=labelStyles bold size='xs')= children
  `
}

Tag.defaultProps = {
  color: 'primary',
  variant: 'flat',
  shape: 'circle',
  iconPosition: 'left'
}

Tag.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  variant: propTypes.oneOf(['flat', 'outlined']),
  shape: propTypes.oneOf(['circle', 'rounded']),
  color: propTypes.string,
  textColor: propTypes.string,
  icon: propTypes.object,
  iconPosition: propTypes.oneOf(['left', 'right']),
  iconColor: propTypes.string
}

export default observer(Tag)
