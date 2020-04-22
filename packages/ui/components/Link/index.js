import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { Link as RNLink } from 'react-router-native'
import { Platform, View } from 'react-native'
import Row from './../Row'
import Icon from './../Icon'
import Span from './../Span'
import _omit from 'lodash/omit'
import config from '../../config/rootConfig'
import './index.styl'

const isMobile = Platform.OS !== 'web'
const { colors } = config

function Link ({
  style,
  children,
  to,
  color,
  size,
  bold,
  italic,
  icon,
  iconPosition,
  iconColor,
  disabled,
  ...props
}) {
  const _color = colors[color] || color
  const _iconColor = colors[iconColor] || iconColor || _color
  const colorStyles = { color: _color }
  const linkStyleNames = {}
  const linkExtraProps = {}

  if (isMobile) {
    linkExtraProps.underlayColor = 'transparent'
    linkExtraProps.activeOpacity = 0.8
    linkExtraProps.disabled = disabled
  } else {
    linkStyleNames.disabled = disabled
  }

  return pug`
    View.root(style=[style])
      RNLink.link(
        style=colorStyles
        styleName=[linkStyleNames]
        to=isMobile || !disabled ? to : null /* pass empty url to href on web */
        ...props
        ...linkExtraProps
      )
        Row(vAlign='center' reverse=iconPosition === 'right')
          if icon
            View.iconWrapper(styleName=[iconPosition])
              Icon(icon=icon color=_iconColor size=size)
          if children
            Span.label(
              style=[colorStyles]
              bold=bold
              italic=italic
              size=size
            )= children
  `
}

Link.defaultProps = {
  ...Span.defaultProps,
  color: colors.primary,
  iconPosition: 'left',
  disabled: false,
  replace: false
}

Link.propTypes = {
  ..._omit(Span.propTypes, ['description']),
  to: propTypes.string,
  color: propTypes.string,
  icon: propTypes.object,
  iconPosition: propTypes.oneOf(['left', 'right']),
  iconColor: propTypes.string,
  disabled: propTypes.bool,
  replace: propTypes.bool
}

export default observer(Link)
