import React from 'react'
import { pug, observer, u } from 'startupjs'
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
  children,
  padding,
  pure,
  width,
  ...props
}) {
  const _rootStyle = {}
  if (padding === true) padding = 2
  if (typeof padding === 'number') {
    _rootStyle.paddingTop = u(padding)
    _rootStyle.paddingBottom = u(padding)
  }

  return pug`
    Div.root(
      part='root'
      style=_rootStyle
      styleName=['width-' + width, { pure }]
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
  padding: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  full: PropTypes.bool,
  width: PropTypes.oneOf(['mobile', 'tablet', 'desktop', 'wide', 'full']),
  pure: PropTypes.bool,
  children: PropTypes.node
}

export default observer(themed('Content', Content))
