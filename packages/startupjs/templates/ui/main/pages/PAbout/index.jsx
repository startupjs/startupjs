import React from 'react'
import { Text } from 'react-native'
import { pug, observer } from 'startupjs'
import { Content, ScrollView } from '@startupjs/ui'
import './index.styl'

export default observer(function PAbout () {
  return pug`
    ScrollView.root
      Content
        Text.text Built on StartupJS
  `
})
