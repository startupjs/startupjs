import React from 'react'
import { observer } from 'startupjs'
import { Platform, SafeAreaView } from 'react-native'
import './index.styl'

export default observer(function ({ children }) {
  return pug`
    Wrapper
      = children
  `
})

const Wrapper = Platform.OS === 'web' ? (
  React.memo(({ children }) => children)
) : (
  React.memo(({ children }) => pug`
    SafeAreaView= children
  `)
)
