import React from 'react'
import { observer } from 'startupjs'
import { View, Text, ScrollView, Switch } from 'react-native'
import * as COMPONENTS from 'ui'
import {
  useComponentName,
  useLocalWithDefault,
  useShowGrid,
  useShowSizes,
  useValidateWidth,
  useDarkTheme
} from 'clientHelpers'
import './index.styl'
const { Br, Row, SmartSidebar, Span } = COMPONENTS
const PATH = '_session.Sidebar'

export default observer(function Sidebar ({ children }) {
  const [componentName, setComponentName] = useComponentName()
  const [showGrid, $showGrid] = useShowGrid()
  const [showSizes, $showSizes] = useShowSizes()
  const [validateWidth, $validateWidth] = useValidateWidth()
  const [darkTheme, $darkTheme] = useDarkTheme()
  useLocalWithDefault(PATH, true)

  // if we will need to use hooks in renderContent method
  // then we need to refactor architecture of SmartSidebar component
  // like in Modal component (Modal, Modal.Actions)
  function renderContent () {
    return pug`
      ScrollView.top
        each COMPONENT_NAME in Object.keys(COMPONENTS).filter(i => /^[A-Z]/.test(i))
          Text.link(
            key=COMPONENT_NAME
            styleName={ active: componentName === COMPONENT_NAME }
            onPress=() => setComponentName(COMPONENT_NAME)
          )= COMPONENT_NAME
      Br(half)
      View
        if showSizes
          Row.line(vAlign='center')
            Span.lineLabel(description) VALIDATE WIDTH
            Switch(
            value=validateWidth
            onValueChange=value => $validateWidth.set(value)
            )
          Row.line(vAlign='center')
            Span.lineLabel(description) SHOW GRID
            Switch(
              value=showGrid
              onValueChange=value => $showGrid.set(value)
            )
        Row.line(vAlign='center')
          Span.lineLabel(description) SHOW SIZES
          Switch(
           value=showSizes
           onValueChange=value => $showSizes.set(value)
          )
        Row.line(vAlign='center')
          Span.lineLabel(description) DARK THEME
          Switch(
           value=darkTheme
           onValueChange=value => $darkTheme.set(value)
          )
    `
  }

  return pug`
    SmartSidebar(path=PATH width=200 renderContent=renderContent)
      = children
  `
})
