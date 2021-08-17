import React from 'react'
import { observer, $root } from 'startupjs'
import { H4 } from '@startupjs/ui'
import Props from '../Props'
import {
  useShowGrid,
  useShowSizes,
  useValidateWidth,
  useDarkTheme
} from '../../clientHelpers'
import './index.styl'

const MODELS = new WeakMap()

export default observer(function Sandbox ({ Component, props, extraParams, block }) {
  const [showGrid] = useShowGrid()
  const [showSizes] = useShowSizes()
  const [validateWidth] = useValidateWidth()
  const [darkTheme] = useDarkTheme()

  if (!Component) {
    return pug`
      H4.error ERROR! Sandbox Component not specified
    `
  }

  return pug`
    Props.root(
      theme=darkTheme ? 'dark' : undefined
      Component=Component
      showSizes=showSizes
      showGrid=showGrid
      validateWidth=validateWidth
      $props=getUniqModel(Component)
      props=props
      extraParams=extraParams
      block=block
    )
  `
})

function getUniqModel (Component) {
  if (MODELS.has(Component)) return MODELS.get(Component)
  const uniqId = $root.id()
  const $uniqModel = $root.scope('_session.Props.' + uniqId)
  MODELS.set(Component, $uniqModel)
  return $uniqModel
}
