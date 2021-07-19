import React from 'react'
import { useLocal, observer } from 'startupjs'
import Div from '../Div'
import Portal from '../Portal'
import Toast from './ToastComponent'
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
            Toast(
              ...toasts[toastKey]
              toastId=toastKey
            )= toasts[toastKey].content
  `
})
