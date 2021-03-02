import React from 'react'
import { observer } from 'startupjs'
import Portal from './'

export default {
  name: 'portal',
  LayoutWrapper: observer(({ children }) => {
    return pug`
      Portal.Provider= children
    `
  })
}
