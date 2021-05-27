import React from 'react'
import { ScrollView } from 'react-native'
import { Div } from '@startupjs/ui'
import './index.styl'

export default function Layout ({ children }) {
  return pug`
    ScrollView
      Div.root
        = children
  `
}
