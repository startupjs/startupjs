import React from 'react'
import { observer } from 'startupjs'
import { ToastProvider } from './components/toast'
import Dialog from './components/Dialog'
import Portal from './components/Portal'
import StyleContext from './StyleContext'

export default {
  name: 'ui',
  LayoutWrapper: observer(({ children, options = {} }) => {
    return pug`
      StyleContext.Provider(value=options.style)
        Portal.Provider
          ToastProvider
          = children
        Dialog
    `
  })
}
