import React, { useEffect } from 'react'
import { pug, observer, $ } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../Div'
import Span from './../../typography/Span'
import themed from '../../../theming/themed'
import './index.styl'

function Td ({ style, children, ellipsis, ...props }) {
  const $full = $()

  useEffect(() => () => $full.del(), [])

  const options = {}

  if (ellipsis) {
    options.onPress = () => $full.set(!$full.get())
    if (!$full.get()) {
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  ellipsis: PropTypes.bool
}

export default observer(themed('Td', Td))
