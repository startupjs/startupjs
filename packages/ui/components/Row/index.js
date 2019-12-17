import React from 'react'
import './index.styl'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { observer } from 'startupjs'

const Row = observer(({
  align = 'right',
  style,
  children,
  ...props
}) => {
  return pug`
    View.root(
      styleName=[align]
      style=style
      ...props
    )
      = children
  `
})

Row.propTypes = {
  align: PropTypes.oneOf(['reverse', 'right', 'center', 'vCenter', 'wrap', 'around', 'between'])
}

export default Row
