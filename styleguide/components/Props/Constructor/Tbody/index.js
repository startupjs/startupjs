import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'

export default observer(function Tbody ({ children, style }) {
  return pug`
    View(style=style)= children
  `
})
