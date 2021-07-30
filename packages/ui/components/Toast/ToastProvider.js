import React from 'react'
import { useLocal, observer } from 'startupjs'
import Portal from '../Portal'
import Toast from './ToastComponent'

export default observer(function ToastProvider () {
  const [toasts = {}] = useLocal('_session.toasts')
  const toastsKeys = Object.keys(toasts)

  return pug`
    Portal
      each toastId, index in toastsKeys
        Toast(
          ...toasts[toastId]
          key=toastId
          _index=index
          _toastId=toastId
          _toastsLength=toastsKeys.length
        )
  `
})
