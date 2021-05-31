import React from 'react'
import { ScrollView } from 'react-native'
import { Layout as SLayout } from '@startupjs/ui'

export default function Layout ({ children }) {
  return pug`
    ScrollView
      SLayout
        = children
  `
}
