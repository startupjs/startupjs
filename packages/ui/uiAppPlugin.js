import React from 'react'
import { observer } from 'startupjs'
import { ToastProvider } from './components/toast'
import { DialogsProvider } from './components/dialogs'
import Portal from './components/Portal'
import StyleContext from './StyleContext'

export default {
  name: 'ui',
  LayoutWrapper: observer(({ children, useOptions }) => {
    const options = useOptions()
    return pug`
      StyleContext.Provider(value=options.style)
        Portal.Provider
          ToastProvider
          = children
        DialogsProvider
    `
  })
}
