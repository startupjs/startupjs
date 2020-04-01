import React, { useState, useEffect } from 'react'
import { observer, useModel, useLocal } from 'startupjs'
import { View, ScrollView, Switch } from 'react-native'
import * as COMPONENTS from 'ui'
import docs from '@startupjs/ui/docs'
import {
  useComponentName,
  useDocName,
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

const SidebarContent = observer(() => {
  // TODO: fix this. It doesn't work with the useParams() hooks properly
  //       because it's located above the current route and because of this
  //       the params are always undefined.
  //       And there is a new warning in React 16.13 which fires for the case
  //       of setting $render.params in the app/Router component:
  //       https://reactjs.org/blog/2020/02/26/react-v16.13.0.html
  //       Also see this issue: https://github.com/facebook/react/issues/18178
  //
  //       The solution is to somehow set $render not during the actual rendering
  //       of Router components but separately, before the Router is going to be rendered.
  //       Probably the best way to do this is to custom handle setting $render
  //       inside the handler function of emit('url', handler).
  //
  //       And when rendering first time from server, $render should be auto populated
  //       from the server side.
  const [, setComponentName] = useComponentName()
  const [componentName] = useLocal('$render.params.componentName')
  const [, setDocName] = useDocName()
  const [docName] = useLocal('$render.params.docName')
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

  return pug`
    ScrollView
      Menu
        Br(half)
        each aDocName in Object.keys(docs)
          Menu.Item(
            key=aDocName
            active=aDocName === docName
            onPress=() => setDocName(aDocName)
          )= aDocName
        Br(half)
        Collapse(
          key='sandbox'
          variant='pure'
          open=openedCollapses.sandbox
          onChange=toggleCollapse.bind(null, 'sandbox')
        )
          Collapse.Header
            Span.sandbox Sandbox
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
})

function renderContent () {
  return pug`SidebarContent`
}

export default observer(function Sidebar ({ children }) {
  const $opened = useModel(PATH)
  useEffect(() => {
    if ($opened.get() == null) $opened.set(true)
  }, [])
  return pug`
    SmartSidebar(path=PATH width=200 renderContent=renderContent)
      = children
  `
})
