import { BASE_URL } from '@env'
import React, { useState } from 'react'
import { observer, useLocal, $root, emit } from 'startupjs'
import { ScrollView, Image } from 'react-native'
import Options from './Options'
import './index.styl'
import { Menu, Br, Collapse, Div, Hr, Button, Row } from '@startupjs/ui'
import {
  useComponentName,
  useDocName
} from '../../../../clientHelpers'
import { useDocsContext } from '../../../../../docsContext'

export default observer(function Content ({
  style
}) {
  const docs = useDocsContext()
  const COMPONENTS = docs.sandbox || {}
  // TODO: Change logo image to base64 and pass it through context
  const baseUrl = BASE_URL
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
    const opened = {}
    if (componentName) opened.sandbox = true
    const chunks = (componentName || '').split('.')
    if ((componentName || '').split('.').length > 1) opened[chunks[0]] = true
    return opened
  })
  const lang = $root.get('$render.params.lang')

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
    Div.root
      ScrollView.main
        Image.logo(source={ uri: baseUrl + '/img/docs.png' })
        Menu
          Br(half)
          each aDocName in Object.keys(docs[lang] || {})
            Menu.Item(
              key=aDocName
              active=aDocName === docName
              onPress=() => setDocName(aDocName)
            )= aDocName
          Hr.hr
          Collapse(
            key='sandbox'
            variant='pure'
            open=openedCollapses.sandbox
            onChange=toggleCollapse.bind(null, 'sandbox')
          )
            Collapse.Header(variant='pure')
              Menu.Item(onPress=() => {
                toggleCollapse('sandbox', !openedCollapses.sandbox)
              }) Sandbox
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
      Row.lang(align='center')
        Button(
          size='s'
          variant='text'
          color=lang === 'en' ? 'primary' : undefined
          onPress=() => emit('url', '/docs/en')
        ) English
        Button(
          size='s'
          variant='text'
          color=lang === 'ru' ? 'primary' : undefined
          onPress=() => emit('url', '/docs/ru')
        ) Русский
      Options
  `
})
