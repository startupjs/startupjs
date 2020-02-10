import React from 'react'
import { observer } from 'startupjs'
import Row from './../Row'
import Button from './../Button'
import './index.styl'

function ModalActions ({
  style,
  children,
  dismissLabel = 'Cancel',
  confirmLabel = 'Confirm',
  onDismiss,
  onConfirm
}) {
  return pug`
    Row.actions(align='right')
      if onDismiss
        Button.action(variant='outlined' onPress=onDismiss)= dismissLabel
      if onConfirm
        Button.action(onPress=onConfirm)= confirmLabel

  `
}

export default observer(ModalActions)
