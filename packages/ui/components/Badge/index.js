import React, { useState } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import Icon from '../Icon'
import Row from '../Row'
import Span from '../typography/Span'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const {
  colors
} = STYLES

const ICON_SIZES = {
  s: 'xs',
  m: 's',
  l: 'm'
}

function Badge ({
  style,
  badgeStyle,
  children,
  color,
  label,
  icon,
  position,
  size,
  variant,
  max
}) {
  if (!colors[color]) console.error('Badge component: Color for color property is incorrect. Use colors from $UI.colors')

  const [right, setRight] = useState(0)

  let _label = label

  if (label > max) {
    _label = max + '+'
  }

  function onLayout (event) {
    const { width } = event.nativeEvent.layout
    setRight(Math.ceil(width / 2) * -1)
  }

  const _badgeStyle = { ...badgeStyle, backgroundColor: colors[color] }

  return pug`
    Div.root(style=style)
      = children
      if (variant === 'default' && label) || variant === 'dot'
        Row.badge(
          onLayout=onLayout
          styleName=[
            size,
            variant,
            position,
            { withLabel: label, visible: right }
          ]
          style=[
            _badgeStyle,
            { right }
          ]
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
  `
}

Badge.defaultProps = {
  color: 'primary',
  position: 'top',
  variant: 'default',
  size: 'm'
}

Badge.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  badgeStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  color: PropTypes.oneOf(Object.keys(colors)),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.object,
  position: PropTypes.oneOf(['top', 'bottom']),
  size: PropTypes.oneOf(['s', 'm', 'l']),
  variant: PropTypes.oneOf(['default', 'dot']),
  max: PropTypes.number
}

export default observer(themed(Badge))
