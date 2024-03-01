import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../Div'
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
  pure,
  width,
  ...props
}) {
  return pug`
    Div.root(
      style=style
      styleName=['width-' + width, { padding, pure }]
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
  pure: PropTypes.bool,
  children: PropTypes.node
}

export default observer(themed('Content', Content))
