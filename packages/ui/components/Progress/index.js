import React from 'react'
import { observer } from 'startupjs'
import { View } from 'react-native'
import propTypes from 'prop-types'
import Span from '../Typography/Span'
import Filler from './filler'
import './index.styl'

function Progress ({
  style,
  value,
  children,
  variant,
  shape
}) {
  return pug`
    View(style=style)
      View.progress(style={ borderRadius: shape === 'round' ? 4 : 0 })
        Filler(value=value shape=shape)
      if typeof children === 'string'
        Span.label(size='s' description)= children
      else
        = children
  `
}

Progress.defaultProps = {
  value: 0,
  variant: 'linear',
  shape: 'round'
}

Progress.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  value: propTypes.number,
  children: propTypes.node,
  variant: propTypes.oneOf(['linear', 'circular']), // TODO: Add circular progress
  shape: propTypes.oneOf(['round', 'square'])
}

export default observer(Progress)
