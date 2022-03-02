import React, { useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
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
  const [right, setRight] = useState(0)

  badgeStyle = StyleSheet.flatten([
    { right, backgroundColor: colors[color] },
    badgeStyle
  ])

  const hasLabel = useMemo(() => {
    return variant === 'default'
      ? typeof label === 'string'
        ? +label !== 0
        : !!label
      : false
  }, [variant, label])

  function getLabel (label, max) {
    return max && label > max ? max + '+' : label
  }

  function onLayout (event) {
    const { width } = event.nativeEvent.layout
    setRight(Math.ceil(width / 2) * -1)
  }

  return pug`
    Div.root(style=style)
      = children
      if hasLabel || variant === 'dot'
        Row.badge(
          style=badgeStyle
          onLayout=onLayout
          styleName=[
            size,
            variant,
            position,
            { hasLabel, visible: !!right }
          ]
        )
          if variant === 'default'
            if icon
              Icon.icon(
                icon=icon
                size=ICON_SIZES[size]
              )
            Span.label(styleName=[size, { icon }])= getLabel(label, max)
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

export default observer(themed('Badge', Badge))
