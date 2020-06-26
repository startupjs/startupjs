import React, { useEffect } from 'react'
import { observer, useModel } from 'startupjs'
import './index.styl'
import { SmartSidebar } from '@startupjs/ui'
import Content from './Content'

const PATH = '_session.Sidebar'

function renderContent () {
  return pug`Content`
}

export default observer(function Sidebar ({ children }) {
  const $opened = useModel(PATH)
  useEffect(() => {
    if ($opened.get() == null) $opened.set(true)
  }, [])
  return pug`
    SmartSidebar(path=PATH width=240 renderContent=renderContent)
      = children
  `
})
