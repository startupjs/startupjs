import React from 'react'
import { pug, observer } from 'startupjs'
import { Content, ScrollView } from '@startupjs/ui'

import TestComponent from './TestComponent'

export default observer(function PPlaywrightExample () {
  console.log('PPlaywrightExamplePPlaywrightExamplePPlaywrightExample')
  return pug`
    ScrollView.root
      Content
        TestComponent
  `
})
