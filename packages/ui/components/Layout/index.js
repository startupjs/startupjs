import React from 'react'
import { observer } from 'startupjs'
import { SafeAreaView } from 'react-native'
import './index.styl'

export default observer(function ({ style, children }) {
  return pug`
    SafeAreaView.root(style=style)
      = children
  `
})
