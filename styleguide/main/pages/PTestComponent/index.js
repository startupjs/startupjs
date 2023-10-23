import React from 'react'
import { SafeAreaView } from 'react-native'
import { pug, observer, useLocal } from 'startupjs'
import { Content } from '@startupjs/ui'
import * as testComponents from './testComponents'

function PTestComponent () {
  const [componentName] = useLocal('$render.params.componentName')
  const Component = testComponents[componentName]

  if (!Component) throw Error(`No tests for component ${componentName} found!`)

  return pug`
    SafeAreaView
      Content
        Component
  `
}

export default observer(PTestComponent)
