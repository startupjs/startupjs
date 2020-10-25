import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'

export default observer(function Tbody ({ children, style }) {
  return pug`
    View(style=style)= children
  `
})
