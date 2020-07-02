import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'

export default observer(function Thead ({ children, style }) {
  return pug`
    View(style=style)= children
  `
})
