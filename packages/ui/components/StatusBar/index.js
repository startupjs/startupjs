import React from 'react'
import { observer } from 'startupjs'
import { View, StatusBar as RNStatusBar } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import config from './../../config/rootConfig'
import propTypes from 'prop-types'
const height = getStatusBarHeight()

function StatusBar ({
  style,
  children,
  backgroundColor = config.colors.darkLighter,
  ...props
}) {
  return pug`
    View(style={
      position: 'absolute',
      top: -height,
      left: 0,
      right: 0,
      height,
      backgroundColor
    })
      RNStatusBar(
        style=style
        backgroundColor=backgroundColor
        barStyle='dark-content'
        ...props
      )
  `
}

StatusBar.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  backgroundColor: propTypes.string
}

export default observer(StatusBar)
