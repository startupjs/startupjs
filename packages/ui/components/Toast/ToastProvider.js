import React from 'react'
import { useLocal, observer } from 'startupjs'
import Div from '../Div'
import Alert from '../Alert'
import Portal from '../Portal'
import './index.styl'

export default observer(function ToastProvider ({ children }) {
  const [toasts = {}] = useLocal('_page.toasts')

  const toastsKeys = Object.keys(toasts)

  return pug`
    = children

    Portal
      if toastsKeys.length
        Div.toasts
          each toastKey in toastsKeys
            Alert.alert(...toasts[toastKey])
              = toasts[toastKey].content
  `
})
