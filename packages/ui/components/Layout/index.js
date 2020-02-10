import React from 'react'
import { observer } from 'startupjs'
import { SafeAreaView } from 'react-native'
import StatusBar from './../StatusBar'
import './index.styl'

export default observer(function Layout ({ style, children }) {
  return pug`
    SafeAreaView.root(style=style)
      StatusBar
      = children
  `
})
