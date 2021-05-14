import React, { useState } from 'react'
import { Platform } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import Icon from '../Icon'
import Row from '../Row'
import Span from '../typography/Span'
import STYLES from './index.styl'

const {
  colors
} = STYLES

const isWeb = Platform.OS === 'web'

const ICON_SIZES = {
  m: 's',
  l: 'm'
}

function Badge ({
  children,
  color,
  label,
  icon,
  position,
  size,
  variant
}) {
  if (!colors[color]) console.error('Badge component: Color for color property is incorrect. Use colors from $UI.colors')

  const [right, setRight] = useState(0)

  function onLayout (event) {
    const { width } = event.nativeEvent.layout
    width && setRight(Math.ceil(width / 2) * -1)
  }

  const style = { backgroundColor: colors[color] }

  if (isWeb) {
    style.transform = 'translate(50%, 0)'
  }

  return pug`
    Div.root
      = children
      Row.badge(
        styleName=[
          size,
          variant,
          position,
          { withLabel: label }
        ]
        style=[
          style,
          { right: isWeb ? 0 : right }
        ]
        onLayout=onLayout
      )
        if variant === 'default'
          if icon
            Icon.icon(
              styleName=[{ withLabel: label }]
              icon=icon
              size=ICON_SIZES[size]
            )
          if label
            Span.label(
                styleName=[size]
                bold=size === 'l'
              )= label
  `
}

Badge.defaultProps = {
  color: 'primary',
  position: 'top',
  variant: 'default',
  size: 'm'
}

Badge.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(Object.keys(colors)),
  label: PropTypes.string,
  icon: PropTypes.object,
  position: PropTypes.oneOf(['top', 'bottom']),
  size: PropTypes.oneOf(['s', 'm', 'l']),
  variant: PropTypes.oneOf(['default', 'dot'])
}

export default observer(Badge)
