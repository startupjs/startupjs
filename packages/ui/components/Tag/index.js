import React from 'react'
import Div from '../Div'
import propTypes from 'prop-types'
import Span from '../Span'
import { observer } from 'startupjs'
import STATUSES from './statuses'
import './index.styl'

function Tag ({
  style,
  status,
  type,
  children,
  label,
  onPress,
  ...props
}) {
  return pug`
    Div.root(
      style=style
      styleName=[status, type]
      onPress=onPress
    )
      if label
        Span.label= label
      = children
  `
}

Tag.propTypes = {
  label: propTypes.string,
  status: propTypes.oneOf(STATUSES),
  type: propTypes.oneOf(['circle', 'rounded'])
}

Tag.defaultProps = {
  status: STATUSES[0],
  type: 'circle'
}

export default observer(Tag)
