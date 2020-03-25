import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Layout, Pagination } from 'ui'
import Sidebar from './Sidebar'
import './index.styl'

export default observer(function StyleguideLayout ({ children }) {
  const [value, setValue] = useState(1)
  return pug`
    Layout
      Sidebar
        Pagination(value=value count=111 onChange=setValue variant='filled')
        = children
  `
})
