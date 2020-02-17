import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { colorToRGBA } from '../../config/helpers'
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
  label,
  onClose
}) {
  const _color = colors[color] || color
  const _iconsColor = iconsColor || _color
  const backgroundColor = colorToRGBA(_color, 0.05)

  return pug`
    Row.root(
      style={ borderWidth: 1, borderColor: _color, backgroundColor }
    )
      Row.content(vAlign='center')
        if icon
          Icon.leftIcon(
            size='l'
            icon=icon
            color=_iconsColor
          )
        if label
          Span(style={ color:_color })= label
      if onClose
        Div.rightIconWrapper(onPress=onClose activeOpacity=0.25)
          Icon.rightIcon(
            size='l'
            icon=closeIcon
            color=_iconsColor
          )
  `
}

Alert.defaultProps = {
  color: 'primary'
}

Alert.propTypes = {
  color: propTypes.string,
  iconsColor: propTypes.string,
  label: propTypes.string,
  onClose: propTypes.func
}

export default observer(Alert)
