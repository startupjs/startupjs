import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Props } from 'components'
import * as COMPONENTS from 'ui'
import {
  useComponentName,
  useShowGrid,
  useShowSizes,
  useValidateWidth,
  useDarkTheme
} from 'clientHelpers'
import './index.styl'

export default observer(function PStyleguide () {
  const [componentName] = useComponentName()
  const [showGrid] = useShowGrid()
  const [showSizes] = useShowSizes()
  const [validateWidth] = useValidateWidth()
  const [darkTheme] = useDarkTheme()
  const segments = componentName.split('.')
  const COMPONENT = segments.reduce((component, segment) => {
    return component[segment]
  }, COMPONENTS)
  const [open, setOpen] = useState(true)

  if (!COMPONENT) {
    return pug`
      COMPONENTS.H1 Component not found
    `
  }

  const Modal = COMPONENTS.Modal

  return pug`
    Modal(visible=open title='bro' onDismiss=() => setOpen(false))
      Modal.Content
        COMPONENTS.Span content super
      COMPONENTS.Span without content
      Modal.Actions(onConfirm=() => {})

    Props.root(
      theme=darkTheme ? 'dark' : undefined
      key=componentName
      Component=COMPONENT
      componentName=componentName
      showSizes=showSizes
      showGrid=showGrid
      validateWidth=validateWidth
    )
  `
})
