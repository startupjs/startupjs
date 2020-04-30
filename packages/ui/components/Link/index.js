import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { Link as RNLink } from 'react-router-native'
import {
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import Span from './../Span'
import './index.styl'

// css-to-react-native fails to parse a complex fontFamily value.
const WEB_FONT = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif"

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
  block,
  ...props
}) {
  const extraProps = {}
  if (isNative) {
    extraProps.component = block ? TouchableOpacity : Text
  }
  return pug`
    InternalLink.root(
      style=[style, isNative ? {} : { fontFamily: WEB_FONT }]
      styleName=[theme, size, { bold, italic, disabled, block }, variant]
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

// This is needed to get styleName and style together and then flatten it manually
// to be able to pass it to pure web react.
function InternalLink ({ style, ...props }) {
  return pug`
    RNLink(
      style=isNative ? style : fixWebStyles(style)
      ...props
    )
  `
}

function fixWebStyles (style) {
  style = StyleSheet.flatten(style)
  for (let key in style) {
    if (key === 'lineHeight' && typeof style[key] === 'number') style[key] += 'px'
  }
  return style
}
