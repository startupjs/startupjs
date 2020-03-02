import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Row from './../../Row'
import Button from './../../Button'
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
    Row.root(style=style align='right')
      if children
        = children
      else
        if onDismiss
          Button.action(
            color='primary'
            onPress=onDismiss
          )= dismissLabel
        if onConfirm
          Button.action(
            color='primary'
            variant='flat'
            onPress=onConfirm
          )= confirmLabel

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
