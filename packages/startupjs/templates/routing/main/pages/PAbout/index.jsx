import React from 'react'
import { Text, ScrollView } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'

export default observer(function PAbout () {
  return pug`
    ScrollView.root
      Text.text Built on StartupJS
  `
})
