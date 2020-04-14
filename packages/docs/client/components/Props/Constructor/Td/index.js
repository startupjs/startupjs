import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'

export default observer(function Td ({ children, style }) {
  return pug`
    View.root(style=style)= children
  `
})
