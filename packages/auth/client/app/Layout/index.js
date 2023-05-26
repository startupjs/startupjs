import React from 'react'
import { ScrollView } from 'react-native'
import { observer } from 'startupjs'
import { Div, Layout as UILayout } from '@startupjs/ui'
import './index.styl'

export default observer(function Layout ({ children }) {
  return pug`
    UILayout
      ScrollView.root
        Div.wrapper
          = children
  `
})
