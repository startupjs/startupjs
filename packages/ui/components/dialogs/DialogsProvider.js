import React, { useState, useEffect } from 'react'
import { pug, observer } from 'startupjs'
import Modal from '../Modal'
import { setUpdateDialogState } from './helpers'

export default observer(function DialogsProvider () {
  const [dialog = {}, setDialog] = useState()
  setUpdateDialogState(setDialog)
  useEffect(() => {
    return () => setUpdateDialogState(undefined)
  }, [])
  return pug`
    if dialog.visible
      Modal(
        ...dialog
        visible=!!dialog.visible
        onRequestClose=() => {
          setDialog()
        }
      )= dialog.children
  `
})
