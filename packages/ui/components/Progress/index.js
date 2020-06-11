import React from 'react'
import { observer, u } from 'startupjs'
import { View } from 'react-native'
import propTypes from 'prop-types'
import Span from '../typography/Span'
import Div from '../Div'
import Filler from './filler'
import './index.styl'

function Progress ({
  style,
  value,
  children,
  variant,
  shape,
  width
}) {
  const extraStyle = { height: width }

  return pug`
    View(style=style)
      Div.progress(style=extraStyle shape=shape)
        //- To normalize value pass value=Math.min(value, 100)
        Filler(style=extraStyle value=value)
      if typeof children === 'string'
        Span.label(size='s' description)= children
      else
        = children
  `
}

Progress.defaultProps = {
  value: 0,
  width: u(0.5),
  variant: 'linear',
  shape: 'rounded'
}

Progress.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  value: propTypes.number,
  children: propTypes.node,
  shape: Div.propTypes.shape,
  width: propTypes.number,
  variant: propTypes.oneOf(['linear', 'circular']) // TODO: Add circular progress
}

export default observer(Progress)
