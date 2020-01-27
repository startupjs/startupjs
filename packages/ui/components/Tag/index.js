import React from 'react'
import { observer } from 'startupjs'
import Div from '../Div'
import Span from '../Span'
import Icon from '../Icon'
import propTypes from 'prop-types'
import COLORS from './colors'
import config from '../../config/rootConfig'
import './index.styl'

const ICON_PROPS = {
  size: 'xs',
  color: config.colors.white
}
function Tag ({
  style,
  color,
  variant,
  icon,
  rightIcon,
  label,
  onPress,
  ...props
}) {
  const iconWrapperStyle = { 'with-label': label }

  return pug`
    Div.root(
      style=style
      styleName=[color, variant]
      onPress=onPress
    )
      if icon
        Div.leftIconWrapper(styleName=[iconWrapperStyle])
          Icon(icon=icon ...ICON_PROPS)
      if label
        Span.label(bold variant='small')= label
      if rightIcon
        Div.rightIconWrapper(styleName=[iconWrapperStyle])
          Icon(icon=rightIcon ...ICON_PROPS)
  `
}

Tag.propTypes = {
  label: propTypes.string,
  color: propTypes.oneOf(COLORS),
  variant: propTypes.oneOf(['circle', 'rounded'])
}

Tag.defaultProps = {
  color: COLORS[0],
  variant: 'circle'
}

export default observer(Tag)
