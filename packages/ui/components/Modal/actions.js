import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Row from './../Row'
import Button from './../Button'
import './index.styl'

function ModalActions ({
  style,
  children,
  dismissLabel,
  confirmLabel,
  onDismiss,
  onConfirm
}) {
  return pug`
    Row.actions(style=style align='right')
      if onDismiss
        Button.action(variant='outlined' onPress=onDismiss)= dismissLabel
      if onConfirm
        Button.action(onPress=onConfirm)= confirmLabel

  `
}

ModalActions.defaultProps = {
  dismissLabel: 'Cancel',
  confirmLabel: 'Confirm'
}

ModalActions.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  dismissLabel: propTypes.string,
  confirmLabel: propTypes.string,
  onDismiss: propTypes.func,
  onConfirm: propTypes.func
}

export default observer(ModalActions)
