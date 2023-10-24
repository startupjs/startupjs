import React from 'react'
import { pug, observer } from 'startupjs'
import Modal from '../Modal'
import { usePageUI } from '../../helpers'

export default observer(function DialogsProvider () {
  const [dialog = {}, $dialog] = usePageUI('dialog')

  return pug`
    Modal(
      ...dialog
      visible=!!dialog.visible
      onRequestClose=() => {
        $dialog.del()
        dialog.onRequestClose && dialog.onRequestClose()
      }
    )= dialog.children
  `
})
