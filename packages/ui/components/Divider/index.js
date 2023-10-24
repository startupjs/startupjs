import React from 'react'
import { View } from 'react-native'
import { pug, observer, u } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const {
  config: {
    heights
  }
} = STYLES
const LINE_HEIGHT = u(2)

function Divider ({
  style,
  size,
  lines,
  variant
}) {
  const lineWidth = heights[size]
  const width = LINE_HEIGHT * lines
  const margin = (width - lineWidth) / 2
  const marginFirstSide = Math.floor(margin)
  const marginSecondSide = Math.ceil(margin)
  const extraStyle = {}

  switch (variant) {
    case 'horizontal':
      extraStyle.height = lineWidth
      extraStyle.marginTop = marginFirstSide
      extraStyle.marginBottom = marginSecondSide
      break
    case 'vertical':
      extraStyle.width = lineWidth
      extraStyle.marginLeft = marginFirstSide
      extraStyle.marginRight = marginSecondSide
      break
  }

  return pug`
    View.root(style=[extraStyle, style] styleName=[size, variant])
  `
}

Divider.defaultProps = {
  size: 'm',
  variant: 'horizontal',
  lines: 1
}

Divider.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  variant: PropTypes.oneOf(['horizontal', 'vertical']),
  size: PropTypes.oneOf(['m', 'l']),
  lines: PropTypes.number
}

export default observer(themed('Divider', Divider))
