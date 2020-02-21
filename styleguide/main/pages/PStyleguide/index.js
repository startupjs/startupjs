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
  const COMPONENT = COMPONENTS[componentName]
  const [value, setValue] = useState()

  if (!COMPONENT) {
    return pug`
      COMPONENTS.H1 Component not found
    `
  }

  return pug`
    COMPONENTS.Span Hello
    COMPONENTS.Checkbox(onChange=setValue value=value)
    COMPONENTS.Checkbox(variant='switch' onChange=setValue value=value)
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
