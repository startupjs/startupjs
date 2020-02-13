import React from 'react'
import { observer, useLocal, $root } from 'startupjs'
import { View, ScrollView } from 'react-native'
import './index.styl'
import Constructor from './Constructor'
import Renderer from './Renderer'
import { themed } from 'ui'

export default observer(themed(function PComponent ({
  Component, componentName, showGrid, style, validateWidth, showSizes, theme
}) {
  $root.setNull(`_session.Props.${componentName}`, {})
  let [props, $props] = useLocal(`_session.Props.${componentName}`)
  return pug`
    View(style=style)
      ScrollView.top(styleName=[theme])
        Constructor(Component=Component $props=$props)
      ScrollView.bottom(
        styleName=[theme]
        contentContainerStyle={
          alignItems: 'center'
        }
      )
        Renderer(
          Component=Component
          props=props
          showGrid=showGrid
          validateWidth=validateWidth
          showSizes=showSizes
        )
  `
}))
