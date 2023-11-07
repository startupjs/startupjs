import React from 'react'
import { pug, observer } from 'startupjs'
import { setDefaultVariables } from '@startupjs/babel-plugin-rn-stylename-to-style/variables'
import defaultVariables from './components/CssVariables/defaultUiVariables'
import Portal from './components/Portal'
import { DialogsProvider } from './components/dialogs'
import { ToastProvider } from './components/toast'
import StyleContext from './StyleContext'

// set default css variables as early as possible
setDefaultVariables(defaultVariables)

export default observer(function Ui ({ children, style }) {
  return pug`
    StyleContext.Provider(value=style)
      Portal.Provider
        ToastProvider
        = children
      DialogsProvider
  `
})
