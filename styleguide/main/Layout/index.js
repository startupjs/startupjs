import React from 'react'
import { observer } from 'startupjs'
import { Layout } from 'ui'
import Sidebar from './Sidebar'
import './index.styl'

export default observer(function StyleguideLayout ({ children }) {
  return pug`
    Layout
      Sidebar
        = children
  `
})
