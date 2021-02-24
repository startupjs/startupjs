import React from 'react'
import { observer } from 'startupjs'
import Portal from './components/Portal'

export default {
  name: 'ui',
  LayoutWrapper: observer(({ children, options }) => {
    return pug`
      Portal.Provider= children
    `
  })
}
