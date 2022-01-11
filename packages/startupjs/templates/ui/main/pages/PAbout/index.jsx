import React from 'react'
import { Text, ScrollView } from 'react-native'
import { pug, observer } from 'startupjs'
import { Content } from '@startupjs/ui'
import './index.styl'

export default observer(function PAbout () {
  return pug`
    ScrollView.root
      Content
        Text.text Built on StartupJS
  `
})
