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
  s: 'xs',
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
  variant,
  max,
  renderLabel
}) {
  if (!colors[color]) console.error('Badge component: Color for color property is incorrect. Use colors from $UI.colors')

  const [right, setRight] = useState(0)

  let _label = label

  if (typeof label === 'number' && label > max) {
    _label = max + '+'
  }

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
              icon=icon
              size=ICON_SIZES[size]
            )
          if label
            Span.label(
              styleName=[size, { withIcon: icon }]
            )= _label
          else if renderLabel
            Div= renderLabel()
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
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.object,
  position: PropTypes.oneOf(['top', 'bottom']),
  size: PropTypes.oneOf(['s', 'm', 'l']),
  variant: PropTypes.oneOf(['default', 'dot']),
  max: PropTypes.number,
  renderLabel: PropTypes.func
}

export default observer(Badge)
