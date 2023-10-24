import React from 'react'
<<<<<<< HEAD
import { observer } from 'startupjs'
import { setDefaultVariables } from '@startupjs/babel-plugin-rn-stylename-to-style/variables'
=======
import { pug, observer } from 'startupjs'
>>>>>>> master
import { ToastProvider } from './components/toast'
import { DialogsProvider } from './components/dialogs'
import Portal from './components/Portal'
import StyleContext from './StyleContext'
import defaultVariables from './components/CssVariables/defaultUiVariables'

// set default css variables as early as possible
setDefaultVariables(defaultVariables)

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
