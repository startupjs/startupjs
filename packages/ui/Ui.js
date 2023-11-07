import React from 'react'
import { pug, observer } from 'startupjs'
import { ToastProvider } from './components/toast'
import { DialogsProvider } from './components/dialogs'
import Portal from './components/Portal'
import StyleContext from './StyleContext'

export default observer(function Ui ({ children, style }) {
  return pug`
    StyleContext.Provider(value=style)
      Portal.Provider
        ToastProvider
        = children
      DialogsProvider
  `
})
