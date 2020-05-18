import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { colorToRGBA } from '../../config/helpers'
import Div from '../Div'
import Span from '../Typography/Span'
import Row from '../Row'
import Icon from '../Icon'
import config from '../../config/rootConfig'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

const { colors } = config

function Alert ({
  color,
  icon,
  iconColor,
  label,
  onClose
}) {
  if (/^#|rgb/.test(color)) console.warn('Alert component: Hex color for color property is deprecated. Use style instead')
  if (/^#|rgb/.test(iconColor)) console.warn('Alert component: Hex color for iconColor property is deprecated. Use style instead')
  const _color = colors[color] || color
  const _iconColor = iconColor || _color
  const backgroundColor = colorToRGBA(_color, 0.05)

  return pug`
    Row.root(
      vAlign='center'
      style={ borderWidth: 1, borderColor: _color, backgroundColor }
    )
      if icon
        Div.leftIconWrapper
          Icon(
            icon=icon
            color=_iconColor
          )
      if label
        Span.label(style={ color: _color } numberOfLines=1)= label
      if onClose
        Div.rightIconWrapper(onPress=onClose)
          Icon.rightIcon(
            icon=faTimes
            color=_color
          )
  `
}

Alert.defaultProps = {
  color: 'primary'
}

Alert.propTypes = {
  color: propTypes.string,
  iconColor: propTypes.string,
  label: propTypes.string,
  onClose: propTypes.func
}

export default observer(Alert)
