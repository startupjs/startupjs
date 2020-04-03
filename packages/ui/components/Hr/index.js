import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { View } from 'react-native'
import './index.styl'

const LINE_SIZE = 8

function Hr ({
  style,
  children,
  size = 'm'
}) {
  const extraStyles = {}
  if (typeof size === 'number') {
    size = undefined
    extraStyles.borderBottomWidth = size
    extraStyles.marginTop = (LINE_SIZE - size) / 2
    extraStyles.marginBottom = (LINE_SIZE - size) / 2
  }
  return pug`
    View.hr(style=style styleName=[size])
  `
}

Hr.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  size: propTypes.oneOfType([propTypes.number, propTypes.oneOf(['m', 'l', 'xl'])])
}

export default observer(Hr)
