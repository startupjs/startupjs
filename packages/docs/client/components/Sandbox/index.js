import React from 'react'
import { observer, $root, useValue } from 'startupjs'
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

export default observer(function Sandbox ({
  Component,
  $props,
  extraParams,
  block,
  ...otherProps
}) {
  const [showGrid] = useShowGrid()
  const [showSizes] = useShowSizes()
  const [validateWidth] = useValidateWidth()
  const [darkTheme] = useDarkTheme()

  if (Object.keys(otherProps).includes('props')) {
    [, $props] = useValue(otherProps.props)
  }

  if (!Component) {
    return pug`
      H4.error ERROR! Sandbox Component not specified
    `
  }

  return pug`
    Props.root(
      Component=Component
      $props=$props || getUniqModel(Component)
      theme=darkTheme ? 'dark' : undefined
      showSizes=showSizes
      showGrid=showGrid
      validateWidth=validateWidth
      block=block
      extraParams=extraParams
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
