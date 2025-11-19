import React from 'react'
import { pug, observer, $, useId } from 'startupjs'
import { H4, Alert } from '@startupjs/ui'
import Props from '../Props'
import {
  useShowGrid,
  useShowSizes,
  useValidateWidth
} from '../../clientHelpers'
import './index.styl'

const MODELS = new WeakMap()

export default observer(function Sandbox ({
  Component,
  propsJsonSchema,
  $props,
  ...otherProps
}) {
  const [showGrid] = useShowGrid()
  const [showSizes] = useShowSizes()
  const [validateWidth] = useValidateWidth()
  const uniqId = useId()

  if (!Component) {
    return pug`
      H4.error ERROR! Sandbox Component not specified
    `
  }

  if (typeof propsJsonSchema !== 'object' || Object.keys(propsJsonSchema).length === 0) {
    return pug`
      Alert(variant='error')
        | No propsJsonSchema provided for the Sandbox component (or it's an empty object).
        | Make sure that:
        |   1. your component file has the magic 'const export _PropsJsonSchema = ' declaration;
        |   2. your component file has 'export interface' with props interface declared;
        |   3. you import the '_PropsJsonSchema' from the component file
        |        and pass it to the Sandbox as 'propsJsonSchema' prop;
        |   4. 'babel-preset-startupjs' must have an option 'docgen: true' enabled
        |        to transform the TS interface to JSON schema at build time.
    `
  }

  return pug`
    Props.root(
      Component=Component
      propsJsonSchema=propsJsonSchema
      $props=$props || getUniqModel(Component, uniqId)
      showSizes=showSizes
      showGrid=showGrid
      validateWidth=validateWidth
      ...otherProps
    )
  `
})

function getUniqModel (Component, uniqId) {
  if (MODELS.has(Component)) return MODELS.get(Component)
  const $uniqModel = $.session.Props[uniqId]
  MODELS.set(Component, $uniqModel)
  return $uniqModel
}
