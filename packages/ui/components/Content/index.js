import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { View } from 'react-native'
import './index.styl'
import config from '../../config/rootConfig'

function Content ({
  style,
  children,
  padding,
  full,
  width,
  ...props
}) {
  return pug`
    View.root(
      style=style
      styleName=['width-' + width, { padding, full }]
      ...props
    )= children
  `
}

Content.defaultProps = {
  padding: false,
  full: false,
  width: config.defaultWidth
}

Content.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  padding: propTypes.bool,
  full: propTypes.bool,
  width: propTypes.oneOf(['mobile', 'tablet', 'desktop', 'wide', 'full']),
  children: propTypes.node
}

export default observer(Content)
