import React from 'react'
import { useLocal, observer } from 'startupjs'
import Portal from '../Portal'
import Toast from './ToastComponent'

export default observer(function ToastProvider () {
  const [toasts = []] = useLocal('_session.toasts')

  return pug`
    Portal
      each toast, index in toasts
        Toast(
          ...toast
          key=toast.toastId
          index=index
        )
  `
})
