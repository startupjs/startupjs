import React from 'react'
import { Text, View } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'

const DEFAULT_WRAP_CHILDREN = false

export default observer(function Table ({
  Component,
  wrapChildren = DEFAULT_WRAP_CHILDREN,
  props: {
    children,
    ...props
  },
  style
}) {
  return pug`
    View(style=style)
      Component(...props)
        if children
          if wrapChildren && typeof children === 'string'
            Text= children
          else
            | #{children}
  `
})
