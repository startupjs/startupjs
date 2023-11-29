import React from 'react'
import { View, Text } from 'react-native'
import { pug } from 'startupjs'
import './index.styl'

export default function Layout ({
  title,
  description,
  children,
  center
}) {
  return pug`
    View.root(styleName={ center })
      if title
        Text.title
          = title
      if description
        Text.description
          = description
      = children
  `
}
