import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import { themed } from 'ui'
import './index.styl'

export default observer(themed(function Tr ({ children, style, theme }) {
  return pug`
    View.root(style=style styleName=[theme])= children
  `
}))
