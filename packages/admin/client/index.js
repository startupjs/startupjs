import React from 'react'
import { pug, observer } from 'startupjs'
import { H6, ScrollView, Content } from '@startupjs/ui'
import MODULE from '../module'

export default observer(function Layout () {
  return pug`
    ScrollView
      Content(width='full' gap padding)
        H6 Admin Dashboard
        MODULE.RenderHook(name='renderHomeBlocks')
  `
})
