import React, { useEffect } from 'react'
import propTypes from 'prop-types'
import { observer, useValue } from 'startupjs'
import Div from '../Div'
import Span from './../typography/Span'
import './index.styl'

function Td ({ style, children, ellipsis, ...props }) {
  const [open, $open] = useValue()

  useEffect(() => () => $open.del(), [])

  const options = {}

  if (ellipsis) {
    options.onPress = () => $open.set(!open)
    if (!open) {
      options.numberOfLines = 1
      options.ellipsizeMode = 'tail'
    }
  }

  return pug`
    Div.root(
      ...props
      style=style
    )
      if typeof children === 'string'
        Span(
          ...options
        )= children
      else
        = children

  `
}

Td.defaultProps = {
  ellipsis: false
}

Td.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  ellipsis: propTypes.bool
}

export default observer(Td)
