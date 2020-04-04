import React, { useState } from 'react'
import { observer, useLocal } from 'startupjs'
import { ScrollView } from 'react-native'
import docs from '@startupjs/ui/docs'
import Options from './Options'
import './index.styl'
import { Menu, Br, Collapse, Span } from '@startupjs/ui'
import * as COMPONENTS from 'ui'
import {
  useComponentName,
  useDocName
} from 'clientHelpers'

export default observer(function Content ({
  style
}) {
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
          Collapse.Header.sandbox
            Span Sandbox
          Collapse.Content
            each componentName in getAvailableComponents(Object.keys(COMPONENTS))
              - const component = COMPONENTS[componentName]
              - const sub = getAvailableComponents(Object.keys(component))

              if sub.length
                Collapse(
                  key=componentName
                  variant='pure'
                  open=openedCollapses[componentName]
                  onChange=toggleCollapse.bind(null, componentName)
                )
                  Collapse.Header
                    MenuItem(name=componentName)
                  Collapse.Content
                    each subName in sub
                      - const subFullName = componentName + '.' + subName
                      MenuItem.subMenuItem(
                        key=subFullName
                        name=subFullName
                      )
              else
                MenuItem(key=componentName name=componentName)
    Br(half)
    Options
  `
})
