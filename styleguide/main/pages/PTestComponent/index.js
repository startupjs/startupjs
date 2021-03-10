import React from 'react'
import { SafeAreaView } from 'react-native'
import { observer, useLocal } from 'startupjs'
import { Content } from '@startupjs/ui'
import { ButtonTests } from './testComponents'

function PTestComponent () {
  const [componentName] = useLocal('$render.params.componentName')

  function getComponent () {
    switch (componentName) {
      case 'Button':
        return pug`ButtonTests`
    }
  }

  return pug`
    SafeAreaView
      Content
        = getComponent()
  `
}

export default observer(PTestComponent)
