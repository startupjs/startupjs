import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import './index.styl'

const LINE_SIZE = 8

function Hr ({
  style,
  children,
  size
}) {
  console.warn('Hr component is deprecated. Use Divider instead.')

  const extraStyles = {}
  if (typeof size === 'number') {
    size = undefined
    const margin = (LINE_SIZE - size) / 2
    extraStyles.borderBottomWidth = size
    extraStyles.marginTop = margin
    extraStyles.marginBottom = margin
  }
  return pug`
    View.hr(style=style styleName=[size])
  `
}

Hr.defaultProps = {
  size: 'm'
}

Hr.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['m', 'l', 'xl'])])
}

export default observer(Hr)
