import React from 'react'
import { observer } from 'startupjs'
import { Text } from 'react-native'
import propTypes from 'prop-types'
import './index.styl'

const Span = observer(({
  children,
  style,
  variant = 'normal',
  bold,
  ...props
}) => {
  return pug`
    Text.root(
      styleName=[variant, { bold }]
      style=style
      ...props
    )= children
  `
})

Span.propTypes = {
  variant: propTypes.oneOf(['normal', 'description', 'small']),
  bord: propTypes.bool
}

export default Span
