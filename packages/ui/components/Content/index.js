import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const {
  config: {
    defaultWidth
  }
} = STYLES

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
  width: defaultWidth
}

Content.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  padding: PropTypes.bool,
  full: PropTypes.bool,
  width: PropTypes.oneOf(['mobile', 'tablet', 'desktop', 'wide', 'full']),
  children: PropTypes.node
}

export default observer(themed(Content))
