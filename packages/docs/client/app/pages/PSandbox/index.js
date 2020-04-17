import React from 'react'
import { observer } from 'startupjs'
import { Props } from '../../../components'
import { useDocsContext } from '../../../../docsContext'
import {
  useComponentName,
  useShowGrid,
  useShowSizes,
  useValidateWidth,
  useDarkTheme
} from '../../../clientHelpers'
import './index.styl'

export default observer(function PStyleguide () {
  const docs = useDocsContext()
  const COMPONENTS = docs.sandbox || {}
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

  return pug`
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
