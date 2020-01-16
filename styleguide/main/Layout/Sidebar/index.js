import React from 'react'
import { observer } from 'startupjs'
import { Text } from 'react-native'
import * as COMPONENTS from 'ui'
import { useComponentName } from 'clientHelpers'
import './index.styl'
const { SmartSidebar } = COMPONENTS

export default observer(function Sidebar ({ children }) {
  const [componentName, setComponentName] = useComponentName()

  // if we will need to use hooks in renderContent method
  // then we need to refactor architecture of SmartSidebar component
  // like in Modal component (Modal, Modal.Actions)
  function renderContent () {
    return pug`
      each COMPONENT_NAME in Object.keys(COMPONENTS)
        Text.link(
          key=COMPONENT_NAME
          styleName={ active: componentName === COMPONENT_NAME }
          onPress=() => setComponentName(COMPONENT_NAME)
        )= COMPONENT_NAME
    `
  }

  return pug`
    SmartSidebar(renderContent=renderContent)
      = children
  `
})
