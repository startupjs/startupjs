import React, { useState } from 'react'
import { observer } from 'startupjs'
import { View, ScrollView, Switch } from 'react-native'
import * as COMPONENTS from 'ui'
import docs from '@startupjs/ui/docs'
import {
  useComponentName,
  useDocName,
  useLocalWithDefault,
  useShowGrid,
  useShowSizes,
  useValidateWidth,
  useDarkTheme
} from 'clientHelpers'
import './index.styl'

const PATH = '_session.Sidebar'
const {
  Br,
  Collapse,
  Row,
  SmartSidebar,
  Span,
  Menu
} = COMPONENTS

export default observer(function Sidebar ({ children }) {
  const [componentName, setComponentName] = useComponentName()
  const [docName, setDocName] = useDocName()
  const [showGrid, $showGrid] = useShowGrid()
  const [showSizes, $showSizes] = useShowSizes()
  const [validateWidth, $validateWidth] = useValidateWidth()
  const [darkTheme, $darkTheme] = useDarkTheme()
  const [openedCollapses, setOpenedCollapses] = useState(() => {
    const opened = { docs: true }
    const chunks = (componentName || '').split('.')
    if ((componentName || '').split('.').length > 1) opened[chunks[0]] = true
    return opened
  })
  useLocalWithDefault(PATH, true)
  // if we will need to use hooks in renderContent method
  // then we need to refactor architecture of SmartSidebar component
  // like in Modal component (Modal, Modal.Actions)
  function getAvailableComponents (components = []) {
    return components.filter(i => /^[A-Z]/.test(i))
  }

  function toggleCollapse (collapseName, value) {
    setOpenedCollapses({ ...openedCollapses, [collapseName]: value })
  }

  function MenuItem ({ style, name }) {
    if (!name) return null
    return pug`
      Menu.Item(
        style=style
        active=componentName === name
        onPress=() => setComponentName(name)
      )= name
    `
  }

  function renderContent () {
    return pug`
      ScrollView
        Menu
          Collapse(
            key='docs'
            open=openedCollapses.docs
            onChange=toggleCollapse.bind(null, 'docs')
          )
            Collapse.Header Documentation
            Collapse.Content
              each aDocName in Object.keys(docs)
                Menu.Item(
                  active=aDocName === docName
                  onPress=() => setDocName(docName)
                )= aDocName
          Collapse(
            key='sandbox'
            open=openedCollapses.sandbox
            onChange=toggleCollapse.bind(null, 'sandbox')
          )
            Collapse.Header Sandbox
            Collapse.Content
              each COMPONENT_NAME in getAvailableComponents(Object.keys(COMPONENTS))
                - const COMPONENT = COMPONENTS[COMPONENT_NAME]
                - const SUBCOMPONENTS = getAvailableComponents(Object.keys(COMPONENT))

                if SUBCOMPONENTS.length
                  Collapse(
                    key=COMPONENT_NAME
                    variant='pure'
                    open=openedCollapses[COMPONENT_NAME]
                    onChange=toggleCollapse.bind(null, COMPONENT_NAME)
                  )
                    Collapse.Header
                      MenuItem(name=COMPONENT_NAME)
                    Collapse.Content
                      each SUBCOMPONENT_NAME in SUBCOMPONENTS
                        - const SUBCOMPONENT_FULLNAME = COMPONENT_NAME + '.' + SUBCOMPONENT_NAME
                        MenuItem.subMenuItem(
                          key=SUBCOMPONENT_FULLNAME
                          name=SUBCOMPONENT_FULLNAME
                        )
                else
                  MenuItem(key=COMPONENT_NAME name=COMPONENT_NAME)
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
