import React from 'react'
import { useLocal, observer } from 'startupjs'
import Portal from '../Portal'
import Toast from './ToastComponent'

export default observer(function ToastProvider () {
  const [toasts = []] = useLocal('_session.toasts')

  if (!toasts.length) return null

  return pug`
    Portal
      each toast in toasts
        Toast(...toast)
  `
})
