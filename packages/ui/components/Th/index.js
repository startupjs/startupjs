import React, { useEffect } from 'react'
import propTypes from 'prop-types'
import { observer, useValue } from 'startupjs'
import { View } from 'react-native'
import Span from '../typography/Span'
import './index.styl'

function Th ({ style, children, ellipsis }) {
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
    View.root(style=style)
      if typeof children === 'string'
        Span(...options bold)= children
      else
        = children

  `
}

Th.defaultProps = {
  ellipsis: false
}

Th.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  ellipsis: propTypes.bool
}

export default observer(Th)
