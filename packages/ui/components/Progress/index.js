import React from 'react'
import { observer } from 'startupjs'
import { View } from 'react-native'
import propTypes from 'prop-types'
import Span from '../Span'
import Filler from './filler'
import './index.styl'

function Progress ({
  style,
  value,
  children,
  variant
}) {
  return pug`
    View(style=style)
      View.progress
        Filler(value=value)
      if typeof children === 'string'
        Span.label(size='s' description)= children
      else
        = children
  `
}

Progress.defaultProps = {
  value: 0,
  variant: 'linear'
}

Progress.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  value: propTypes.number,
  children: propTypes.node,
  variant: propTypes.oneOf(['linear', 'circular']) // TODO: Add circular progress
}

export default observer(Progress)
