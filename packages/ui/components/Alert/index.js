import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { colorToRGBA } from '../../config/helpers'
import { faStar, faTimes } from '@fortawesome/free-solid-svg-icons'
import Div from '../Div'
import Span from '../Span'
import Row from '../Row'
import Icon from '../Icon'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

function Alert ({
  color,
  icon,
  iconsColor,
  closeIcon,
  hideCloseButton,
  onClose
}) {
  const _color = colors[color] || color || colors.primary
  const _iconsColor = iconsColor || _color
  const backgroundColor = colorToRGBA(_color, 0.05)

  return pug`
    Div.root(
      style={ borderWidth: 1, borderColor: _color, backgroundColor }
    )
      Row.content(vAlign='center')
        if icon
          View.leftIconWrapper
            Icon.leftIcon(
              size='l'
              icon=icon
              color=_iconsColor
            )
        Span(style={ color:_color }) Hello Alert!
      if onClose
        Div.rightIconWrapper( onPress=onClose )
          Icon.rightIcon(
            size='l'
            icon=closeIcon
            color=_iconsColor
          )
  `
}

Alert.defaultProps = {
  color: 'primary',
  closeIcon: faTimes,
  icon: faStar,
  onClose: () => null
}

Alert.propTypes = {
  color: propTypes.string,
  iconsColor: propTypes.string,
  onClose: propTypes.func
}

export default observer(Alert)
