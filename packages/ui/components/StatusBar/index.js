import React from 'react'
import { observer } from 'startupjs'
import { View, StatusBar } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import config from './../../config/rootConfig'
const height = getStatusBarHeight()

export default observer(function ({
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
      StatusBar(
        backgroundColor=backgroundColor
        barStyle='dark-content'
        ...props
      )
  `
})
