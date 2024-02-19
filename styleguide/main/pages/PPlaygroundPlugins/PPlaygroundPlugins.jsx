import React from 'react'
import { pug, observer } from 'startupjs'
import { Content, H4 } from '@startupjs/ui'
import MODULE from './module'

export default observer(function PPlayground () {
  return pug`
    Content(width='mobile')
      H4 Plugins playground
      MODULE.RenderHook(name='renderMessage' username='John Smith')
  `
})
