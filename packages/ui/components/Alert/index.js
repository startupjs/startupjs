import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { colorToRGBA } from '../../config/helpers'
import Div from '../Div'
import Span from '../Span'
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
  const _color = colors[color] || color
  const _iconColor = iconColor || _color
  const backgroundColor = colorToRGBA(_color, 0.05)

  return pug`
    Row.root(
      vAlign='center'
      style={ borderWidth: 1, borderColor: _color, backgroundColor }
    )
      if icon
        Icon.leftIcon(
          size='l'
          icon=icon
          color=_iconColor
        )
      if label
        Span.label(style={ color: _color } numberOfLines=1)= label
      if onClose
        Div.rightIconWrapper(onPress=onClose)
          Icon.rightIcon(
            size='l'
            icon=faTimes
            color=colors.dark
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
