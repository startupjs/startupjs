import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { Link as RNLink } from 'react-router-native'
import { Platform, Text, TouchableOpacity } from 'react-native'
import Span from './../Span'
import './index.styl'

const isNative = Platform.OS !== 'web'

function Link ({
  style,
  children,
  to,
  disabled,
  variant,
  theme,
  size,
  bold,
  italic,
  description,
  block,
  ...props
}) {
  const extraProps = {}
  if (isNative) {
    extraProps.component = block ? TouchableOpacity : Text
  }
  return pug`
    RNLink.root(
      style=style
      styleName=[theme, size, { bold, italic, description, disabled}, variant]
      disabled=disabled
      to=disabled ? null : to /* pass empty url to href on web */
      ...props
      ...extraProps
    )= children
  `
}

Link.defaultProps = {
  ...Span.defaultProps,
  disabled: false,
  replace: false,
  block: false,
  variant: 'default'
}

Link.propTypes = {
  ...Span.propTypes,
  to: propTypes.string,
  disabled: propTypes.bool,
  replace: propTypes.bool,
  block: propTypes.bool,
  variant: propTypes.oneOf(['default', 'primary'])
}

export default observer(Link)
