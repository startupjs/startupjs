import React from 'react'
import { Text, ScrollView } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'
import { Content } from '@startupjs/ui'

export default observer(function PAbout () {
  return pug`
    ScrollView.root
      Content
        Text.text Built on StartupJS
  `
})
