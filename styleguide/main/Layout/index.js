import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Layout, Radio, Div, Span } from 'ui'
import Sidebar from './Sidebar'
import './index.styl'

export default observer(function StyleguideLayout ({ children }) {
  const [value, setValue] = useState()

  function onChange (value) {
    console.log('click')
    setValue(value)
  }

  return pug`
    Layout
      Sidebar
        Radio(value=value onChange=onChange)
          Div.menuItem(value='foo' styleName={checked: value === 'foo'})
            Span foo
          Div.menuItem(value='bar' styleName={checked: value === 'bar'})
            Span bar
          Div.menuItem(value='baz' styleName={checked: value === 'baz'})
            Span baz
        = children
  `
})
