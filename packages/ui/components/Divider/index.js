import React from 'react'
import { observer, u } from 'startupjs'
import propTypes from 'prop-types'
import { View } from 'react-native'
import config from '../../config/rootConfig'
import './index.styl'

const { heights } = config.Divider
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
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  variant: propTypes.oneOf(['horizontal', 'vertical']),
  size: propTypes.oneOf(['m', 'l']),
  lines: propTypes.number
}

export default observer(Divider)
