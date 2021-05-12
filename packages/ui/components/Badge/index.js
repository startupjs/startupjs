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
  m: 'xs',
  l: 'm',
  default: 'xs'
}

function Badge ({
  children,
  color,
  label,
  icon,
  position,
  size, // DEPRECATED
  variant
}) {
  if (!colors[color]) console.error('Badge component: Color for color property is incorrect. Use colors from $UI.colors')
  if (size) {
    console.warn('[@startupjs/ui] Badge: prop size is DEPRECATED, use variant instead.')
    // TODO: It is necessary to remove all references to size in the next major version
    variant = size
  }

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
        if variant !== 'dot' && variant !== 's'
          if icon
            Icon.icon(
              styleName=[{ withLabel: label }]
              icon=icon
              size=ICON_SIZES[variant]
            )
          if label
            Span.label(
                styleName=[variant]
                bold=variant === 'l'
              )= label
  `
}

Badge.defaultProps = {
  color: 'primary',
  position: 'top',
  variant: 'default'
}

Badge.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(Object.keys(colors)),
  label: PropTypes.string,
  icon: PropTypes.object,
  position: PropTypes.oneOf(['top', 'bottom']),
  variant: PropTypes.oneOf(['default', 'dot'])
}

export default observer(Badge)
