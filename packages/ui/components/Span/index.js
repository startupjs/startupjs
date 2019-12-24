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

Span.defaultProps = {
  variant: 'normal',
  bold: false
}

Span.propTypes = {
  variant: propTypes.oneOf(['normal', 'description', 'small']),
  bold: propTypes.bool
}

export default Span
