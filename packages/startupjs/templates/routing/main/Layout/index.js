import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { observer, emit } from 'startupjs'
import './index.styl'

export default observer(function ({ children }) {
  return pug`
    View.menu
      TouchableOpacity.item(onPress=() => emit('url', '/'))
        Text.logo App
      TouchableOpacity.item(onPress=() => emit('url', '/about'))
        Text About us
    View.body= children
  `
})
