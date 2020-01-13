import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { Text } from 'react-native'
import './index.styl'

const Span = observer(({
  children,
  style,
  variant,
  bold,
  description,
  ...props
}) => {
  return pug`
    Text.root(
      styleName=[variant, { bold, description }]
      style=style
      ...props
    )= children
  `
})

Span.defaultProps = {
  variant: 'normal',
  bold: false,
  description: false
}

Span.propTypes = {
  variant: propTypes.oneOf(['normal', 'caption', 'small']),
  bold: propTypes.bool,
  description: propTypes.bool
}

export default Span
