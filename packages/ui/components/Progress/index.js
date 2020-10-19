import React from 'react'
import { observer, u } from 'startupjs'
import PropTypes from 'prop-types'
import { View } from 'react-native'
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
        Span.label(description)= children
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.number,
  children: PropTypes.node,
  shape: Div.propTypes.shape,
  width: PropTypes.number,
  variant: PropTypes.oneOf(['linear', 'circular']) // TODO: Add circular progress
}

export default observer(Progress)
