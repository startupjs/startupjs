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

  if (!COMPONENT) {
    return pug`
      COMPONENTS.H1 Component not found
    `
  }

  const [open, setOpen] = useState()
  const Collapse = COMPONENTS.Collapse

  return pug`
    Collapse(open=open onChange=setOpen)
      Collapse.Title Hello title!!!
      COMPONENTS.Span Mega super content!!!

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
