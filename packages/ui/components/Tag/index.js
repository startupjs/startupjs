import React from 'react'
import Div from '../Div'
import propTypes from 'prop-types'
import Span from '../Span'
import { observer } from 'startupjs'
import SHADOWS from '../Div/shadows'
import STATUSES from './statuses'
import './index.styl'

function Tag ({
  style,
  status,
  children,
  label,
  level,
  onPress,
  ...props
}) {
  return pug`
    Div.root(
      style=style
      styleName=[status]
      level=level
      onPress=onPress
    )
      if label
        Span.label= label
      = children
  `
}

Tag.propTypes = {
  label: propTypes.string,
  level: propTypes.oneOf(Object.keys(SHADOWS).map(k => +k)),
  status: propTypes.oneOf(STATUSES)
}

Tag.defaultProps = {
  level: 0,
  status: STATUSES[0]
}

export default observer(Tag)
