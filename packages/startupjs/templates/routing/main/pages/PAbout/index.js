import React from 'react'
import { observer } from 'startupjs'
import { Text } from 'react-native'
import './index.styl'

export default observer(function PAbout () {
  return pug`
    Text.text Built on StartupJS
  `
})
