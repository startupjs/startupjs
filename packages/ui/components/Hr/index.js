import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
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
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  size: propTypes.oneOfType([propTypes.number, propTypes.oneOf(['m', 'l', 'xl'])])
}

export default observer(Hr)
