import React from 'react'
import { pug, observer } from 'startupjs'
import { Div, Layout as UILayout, ScrollView } from '@startupjs/ui'
import './index.styl'

export default observer(function Layout ({ children }) {
  return pug`
    UILayout
      ScrollView.root
        Div.wrapper
          = children
  `
})
