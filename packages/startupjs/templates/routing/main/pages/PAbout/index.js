import React from 'react'
import { observer } from 'startupjs'
import { Text, ScrollView } from 'react-native'
import './index.styl'

export default observer(function PAbout () {
  return pug`
    ScrollView.root
      Text.text Built on StartupJS
  `
})
