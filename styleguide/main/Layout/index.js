import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Layout, Radio } from 'ui'
import Sidebar from './Sidebar'
import './index.styl'

export default observer(function StyleguideLayout ({ children }) {
  const [value, setValue] = useState()
  console.log(value)
  const data = [{ value: 'foo', label: 'foo' }, { value: 'bar', label: 'bar' }]
  return pug`
    Layout
      Radio(data=data value=value onChange=(val) => setValue(val))
      Sidebar
        = children
  `
})
