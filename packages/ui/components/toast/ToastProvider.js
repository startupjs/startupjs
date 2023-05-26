import React from 'react'
import { observer } from 'startupjs'
import Portal from '../Portal'
import { useToasts } from './helpers'
import Toast from './ToastComponent'

export default observer(function ToastProvider () {
  const [toasts] = useToasts()

  if (!toasts.length) return null

  return pug`
    Portal
      each toast in toasts
        Toast(...toast)
  `
})
